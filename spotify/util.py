from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .models import SpotifyToken, Vote
from .credentials import SpotifyCreds

BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def create_update_user_tokens(
    session_id, access_token, token_type, expires_in, refresh_token
):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(
            update_fields=[
                "access_token",
                "refresh_token",
                "expires_in",
                "token_type",
            ]
        )
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
            token_type=token_type,
        )
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)

    if tokens:
        expiry = tokens.expires_in

        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": SpotifyCreds.CLIENT_ID,
            "client_secret": SpotifyCreds.CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    expires_in = response.get("expires_in")

    create_update_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token
    )


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    """Sends an API request to the Spotify base url + endpoint"""
    tokens = get_user_tokens(session_id)
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {tokens.access_token}",
    }
    if post_:
        post(f"{BASE_URL}{endpoint}", headers=headers)

    elif put_:
        put(f"{BASE_URL}{endpoint}", headers=headers)

    else:
        response = get(f"{BASE_URL}{endpoint}", {}, headers=headers)
        try:
            return response.json()
        except ValueError:
            return {"Error": "Issue with request"}


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)


def update_room_song(room, song_id):
    current_song = room.current_song

    if current_song != song_id:
        room.current_song = song_id
        room.save(update_fields=["current_song"])
        votes = Vote.objects.filter(room=room).delete()
