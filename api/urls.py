from django.urls import path

from api.views import main, RoomView

urlpatterns = [
    path("room", RoomView.as_view()),
]
