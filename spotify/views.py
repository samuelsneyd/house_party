from decouple import config
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from requests import Request, post


class SpotifyCreds:
    CLIENT_ID = config("SPOTIFY_CLIENT_ID")
    CLIENT_SECRET = config("SPOTIFY_CLIENT_SECRET")
    REDIRECT_URI = ""


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"
        url = (
            Request(
                "GET",
                "https://accounts.spotify.com/authorize",
                params={
                    "scope": scopes,
                    "response-type": "code",
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
