import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';

export default function Room() {
  const [votesToSkip, setVotes] = useState(2);
  const [guestCanPause, setGuestPause] = useState(false);
  const [isHost, setHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuth, setSpotifyAuth] = useState(false);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRoomDetails();
    return () => {
    };
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
        setVotes(data.votes_to_skip ?? '');
        setGuestPause(data.guest_can_pause ?? false);
        setHost(data.is_host ?? false);
        if (data.is_host) {
          authenticateSpotify();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuth(data.status);
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align={'center'}>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align={'center'}>
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align={'center'}>
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button> </Grid>
      </Grid>
    );
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

  if (showSettings) {
    return renderSettings();
  }

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
        {isHost ? renderSettingsButton() : null}
      </Grid>
      <Grid item xs={12} align={'center'}>
        <Button
          variant={'contained'}
          color={'secondary'}
          onClick={leaveRoom}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
