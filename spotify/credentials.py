from decouple import config


class SpotifyCreds:
    CLIENT_ID = config("SPOTIFY_CLIENT_ID")
    CLIENT_SECRET = config("SPOTIFY_CLIENT_SECRET")
    REDIRECT_URI = ""
