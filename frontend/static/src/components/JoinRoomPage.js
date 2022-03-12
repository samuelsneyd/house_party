import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';


export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value.toUpperCase());
  };

  const enterRoom = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code: roomCode})
    };
    fetch('/api/join-room', options).then((response) => {
      if (response.ok) {
        navigate(`/room/${roomCode}`);
      } else {
        setError('Room not found');
      }
    }).catch((error) => {
      console.log(error);
    })
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={!!error}
          label="Code"
          placeholder="Enter a room code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={enterRoom}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          to="/"
          component={Link}
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
