from decouple import config


class SpotifyCreds:
    CLIENT_ID = config("SPOTIFY_CLIENT_ID")
    CLIENT_SECRET = config("SPOTIFY_CLIENT_SECRET")
    REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"
