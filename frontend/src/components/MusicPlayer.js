import React from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import { PlayArrow, SkipNext, Pause } from '@material-ui/icons';

const MusicPlayer = props => {
  const {
    is_playing,
    image_url,
    votes,
    votes_required,
    progress,
    duration,
    title,
    artist
  } = props;
  const songProgress = (progress / duration) * 100;

  const pauseSong = () => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/spotify/pause', options)
      .catch((error) => console.log(error));
  };

  const playSong = () => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/spotify/play', options)
      .catch((error) => console.log(error));
  };

  const skipSong = () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/spotify/skip', options)
      .catch((error) => console.log(error));
  };

  return (
    <Card className={'gradient'}>
      <Grid container alignItems={'center'}>
        <Grid item align={'center'} xs={4}>
          <img
            src={image_url}
            height={'100%'}
            width={'100%'}
            alt={'Album cover'}
          />
        </Grid>
        <Grid item align={'center'} xs={8}>
          <Typography component={'h5'} variant={'h5'}>
            {title}
          </Typography>
          <Typography color={'textSecondary'} variant={'subtitle1'}>
            {artist}
          </Typography>
          <div>
            <IconButton onClick={() => {
              is_playing ? pauseSong() : playSong();
            }}>
              {is_playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={skipSong}>
              <SkipNext />
              <Typography color={'textSecondary'} variant={'subtitle2'}>
                {votes}{'/'}{votes_required}
              </Typography>
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress
        variant={'determinate'}
        value={songProgress}
        transition
      />
    </Card>
  );
};

export default MusicPlayer;
