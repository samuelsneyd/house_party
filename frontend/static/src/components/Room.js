import React, { useState } from 'react';
import { useParams } from 'react-router';

export default function Room(props) {
    const [votesToSkip, setVotes] = useState(2);
    const [guestCanPause, setGuestPause] = useState(false);
    const [isHost, setHost] = useState(false);
    const { roomCode } = useParams();
    const testFunc = () => {
        console.log(roomCode);
    };
    const getRoomDetails = () => {
        fetch(`/api/get_room?code=${roomCode}`)
            .then((response) => response.json())
            .then((data) => {
                setVotes(data.votes_to_skip)
                setGuestPause(data.guest_can_pause)
                setHost(data.is_host)
        })
    }

    getRoomDetails();

    return (
        <div>
            <h3>Room Code: {roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest can pause: {guestCanPause.toString()}</p>
            <p onClick={testFunc}>Host: {isHost.toString()}</p>
        </div>
    );
}
