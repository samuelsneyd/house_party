from django.urls import path

from api.views import RoomView, CreateRoomView, GetRoom, JoinRoom

urlpatterns = [
    path("room", RoomView.as_view()),
    path("create", CreateRoomView.as_view()),
    path("get-room", GetRoom.as_view()),
    path("join-room", JoinRoom.as_view()),
]
