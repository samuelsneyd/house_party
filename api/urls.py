from django.urls import path

from api.views import main, RoomView

urlpatterns = [
    path("home", RoomView.as_view()),
]
