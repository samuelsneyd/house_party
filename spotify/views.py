from decouple import config

SPOTIFY = {
    "CLIENT_ID": config("SPOTIFY_CLIENT_ID"),
    "CLIENT_SECRET": config("SPOTIFY_CLIENT_SECRET"),
    "RETURN_URI": "",
}
