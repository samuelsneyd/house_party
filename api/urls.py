from django.urls import path

from api.views import RoomView, CreateRoomView

urlpatterns = [
    path("room", RoomView.as_view()),
    path("create", CreateRoomView.as_view()),
]
