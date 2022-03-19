import React, { useEffect } from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import { PlayArrow, SkipNext, Pause } from '@material-ui/icons';

function MusicPlayer(props) {
  const songProgress = (props.progress / props.duration) * 100;

  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <Card>
      <Grid container alignItems={'center'}>
        <Grid item align={'center'} xs={4}>
          <img src={props.image_url} height={'100%'} width={'100%'}/>
        </Grid>
        <Grid item align={'center'} xs={8}>
          <Typography component={'h5'} variant={'h5'}>
            {props.title}
          </Typography>
          <Typography color={'textSecondary'} variant={'subtitle1'}>
            {props.artist}
          </Typography>
          <div>
            <IconButton>
              {props.is_playing ? <Pause/> : <PlayArrow/>}
            </IconButton>
            <IconButton>
              <SkipNext/>
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant={'determinate'} value={songProgress}/>
    </Card>
  );
}

export default MusicPlayer;
