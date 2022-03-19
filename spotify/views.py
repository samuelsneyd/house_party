from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from requests import Request, post
from api.models import Room
from .util import (
    create_update_user_tokens,
    is_spotify_authenticated,
    execute_spotify_api_request,
)
from .credentials import SpotifyCreds


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"
        url = (
            Request(
                "GET",
                "https://accounts.spotify.com/authorize",
                params={
                    "scope": scopes,
                    "response_type": "code",
                    "redirect_uri": SpotifyCreds.REDIRECT_URI,
                    "client_id": SpotifyCreds.CLIENT_ID,
                },
            )
            .prepare()
            .url
        )

        return Response({"url": url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get("code")
    request_error = request.GET.get("error")

    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": SpotifyCreds.REDIRECT_URI,
            "client_id": SpotifyCreds.CLIENT_ID,
            "client_secret": SpotifyCreds.CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    response_error = response.get("error")

    if not request.session.exists(request.session.session_key):
        request.session.create()

    create_update_user_tokens(
        request.session.session_key,
        access_token,
        token_type,
        expires_in,
        refresh_token,
    )

    return redirect("frontend:")


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)

        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get("room_code")
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response(
                {"message": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if "error" in response or "item" not in response:
            return Response({}, status.HTTP_204_NO_CONTENT)

        item = response.get("item")
        title = item.get("name")
        duration = item.get("duration_ms")
        progress = response.get("progress_ms")
        album_cover = item.get("album").get("images")[0].get("url")
        is_playing = response.get("is_playing")
        song_id = item.get("id")

        artist_string = ""

        for i, artist in enumerate(item.get("artists")):
            if i > 0:
                artist_string += ", "
            name = artist.get("name")
            artist_string += name

        song = {
            "title": title,
            "artist": artist_string,
            "duration": duration,
            "progress": progress,
            "image_url": album_cover,
            "is_playing": is_playing,
            "votes": 0,
            "id": song_id,
        }

        return Response(song, status=status.HTTP_200_OK)
