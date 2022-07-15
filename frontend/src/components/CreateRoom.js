import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
  Button, Grid, Typography, TextField,
  FormHelperText, FormControl, Radio,
  RadioGroup, FormControlLabel, Collapse
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const CreateRoom = props => {
  const [update] = useState(props.update ?? false);
  const [guestCanPause, setGuestPause] = useState(props.guestCanPause ?? true);
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip ?? 2);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const title = props.update ? 'Update Room' : 'Create Room';

  const handleVotesChange = (e) => setVotesToSkip(e.target.value);
  const handleGuestCanPauseChange = (e) => setGuestPause(e.target.value === 'true');

  const createRoom = () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause
      })
    };
    fetch('/api/create-room', options)
      .then((response) => response.json())
      .then((data) => {
        navigate(`/room/${data.code}`);
      });
  };

  const updateRoom = () => {
    const options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode
      })
    };
    fetch('/api/update-room', options)
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Updated successfully!');
        } else {
          setErrorMessage('An unexpected error occurred');
        }
      })
      .then(() => {
        props.updateCallback();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align={'center'}>
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={createRoom}
          >
            Create
          </Button>
        </Grid>
        <Grid item xs={12} align={'center'}>
          <Button
            color={'secondary'}
            variant={'contained'}
            to={'/'}
            component={Link}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align={'center'}>
        <Button
          color={'primary'}
          variant={'contained'}
          onClick={updateRoom}
        >
          Update
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align={'center'}>
        <Collapse in={!!(errorMessage || successMessage)}>
          {
            errorMessage
              ? <Alert
                severity={'error'}
                onClose={() => setErrorMessage('')}>{errorMessage}
              </Alert>
              : <Alert
                severity={'success'}
                onClose={() => setSuccessMessage('')}>{successMessage}
              </Alert>
          }
        </Collapse>
      </Grid>
      <Grid item xs={12} align={'center'}>

      </Grid>
      <Grid item xs={12} align={'center'}>
        <Typography component={'h4'} variant={'h4'}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <FormControl component={'fieldset'}>
          <FormHelperText component={'div'}>
            <div align={'center'}>Guest Playback Controls</div>
            <RadioGroup
              row value={guestCanPause.toString()}
              onChange={handleGuestCanPauseChange}
            >
              <FormControlLabel
                value={'true'}
                control={<Radio color="primary" />}
                label={'Play/Pause'}
                labelPlacement={'bottom'}
              />
              <FormControlLabel
                value={'false'}
                control={<Radio color="secondary" />}
                label={'No Control'}
                labelPlacement={'bottom'}
              />
            </RadioGroup>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align={'center'}>
        <FormControl>
          <TextField
            required={true}
            type={'number'}
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: 'center' }
            }}
          />
          <FormHelperText component={'div'}>
            <div align={'center'}>
              Votes Required to Skip Song
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoom;
