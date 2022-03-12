import React, { useEffect, useState } from 'react';
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user-in-room')
      .then((response) => response.json())
      .then((data) => {
        if (data.code) {
          navigate(`/room/${data.code}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align={'center'}>
        <Typography variant={'h3'} component={'h3'}>
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <ButtonGroup
          disableElevation
          variant={'contained'}
          color={'primary'}
        >
          <Button color={'primary'} to={'/join'} component={Link}>
            Join Room
          </Button>
          <Button color={'secondary'} to={'/create'} component={Link}>
            Create Room
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} align={'center'}>

      </Grid>
      <Grid item xs={12} align={'center'}>

      </Grid>
    </Grid>
  );
}
