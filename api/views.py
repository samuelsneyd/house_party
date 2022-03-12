from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import RoomSerializer, CreateRoomSerializer
from api.models import Room


ROOM_CODE_FIELD = "room_code"


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status.HTTP_200_OK)

            return Response(
                {"Room not found": "Invalid room code"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"Bad Request": "Code parameter not found in request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class JoinRoom(APIView):
    lookup_kwarg = "code"

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_kwarg)
        if code is not None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session[ROOM_CODE_FIELD] = code

                return Response(
                    {"message": f"Room {room.code} joined"},
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"Bad Request": "Invalid room code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"Bad Request": "Invalid post data, code not included"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
            else:
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                room.save()

            self.request.session[ROOM_CODE_FIELD] = room.code

            return Response(
                RoomSerializer(room).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"Invalid request": "Invalid data"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            "code": self.request.session.get(ROOM_CODE_FIELD),
        }

        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if ROOM_CODE_FIELD in self.request.session:
            self.request.session.pop(ROOM_CODE_FIELD)
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)

            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response(
            {"Message": "Successfully left room"},
            status=status.HTTP_200_OK,
        )
