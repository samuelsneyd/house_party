import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Grid, Button, Typography } from '@material-ui/core';

export default function Room() {
  const [votesToSkip, setVotes] = useState(2);
  const [guestCanPause, setGuestPause] = useState(false);
  const [isHost, setHost] = useState(false);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRoomDetails();
    return () => {};
  }, []);

  const getRoomDetails = () => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          leaveRoom();
        }
        return response.json();
      })
      .then((data) => {
        setVotes(data.votes_to_skip || '');
        setGuestPause(data.guest_can_pause || '');
        setHost(data.is_host || '');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const leaveRoom = () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/leave-room', options)
      .then(() => {
        navigate('/');
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align={'center'}>
        <Typography variant={'h4'} component={'h4'}>
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <Typography variant={'h6'} component={'h6'}>
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <Typography variant={'h6'} component={'h6'}>
          Guest can pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <Typography variant={'h6'} component={'h6'}>
          Host: {isHost.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <Button
          variant={'contained'}
          color={'secondary'}
          to={'/'}
          onClick={leaveRoom}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
