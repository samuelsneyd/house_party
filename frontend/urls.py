from django.urls import path
from frontend import views

app_name = "frontend"

urlpatterns = [
    path("", views.index, name=""),
    path("join", views.index, name="join"),
    path("create", views.index, name="create"),
    path("room/<str:roomCode>", views.index),
    path("room", views.index, name="room"),
]
