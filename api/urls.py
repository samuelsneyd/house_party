from django.urls import path

from api.views import RoomView, CreateRoomView, GetRoom

urlpatterns = [
    path("room", RoomView.as_view()),
    path("create", CreateRoomView.as_view()),
    path("get_room", GetRoom.as_view()),
]
