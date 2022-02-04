import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {
    Button, Grid, Typography, TextField,
    FormHelperText, FormControl, Radio,
    RadioGroup, FormControlLabel
} from '@material-ui/core';

export default function CreateRoomPage(props) {
    const defaultVotes = 2;
    const [guestCanPause, setGuestPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const navigate = useNavigate();

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }
    const handleGuestCanPauseChange = (e) => {
        setGuestPause(e.target.value === 'true');
    }
    const handleRoomButtonClicked = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            })
        };
        const response = await fetch('/api/create', requestOptions);
        const data = await response.json();
        navigate(`/room/${data.code}`);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align={'center'}>
                <Typography component={'h4'} variant={'h4'}>
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align={'center'}>
                <FormControl component={'fieldset'}>
                    <FormHelperText component={'div'}>
                        <div align={'center'}>Guest Playback Controls</div>
                        <RadioGroup
                            row defaultValue={'true'}
                            onChange={handleGuestCanPauseChange}
                        >
                            <FormControlLabel
                                value={'true'}
                                control={<Radio color='primary'/>}
                                label={'Play/Pause'}
                                labelPlacement={'bottom'}
                            />
                            <FormControlLabel
                                value={'false'}
                                control={<Radio color='secondary'/>}
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
                        defaultValue={defaultVotes}
                        inputProps={{
                            min: 1,
                            style: {textAlign: 'center'},
                        }}
                    />
                    <FormHelperText component={'div'}>
                        <div align={'center'}>
                            Votes Required to Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align={'center'}>
                <Button
                    color={'primary'}
                    variant={'contained'}
                    onClick={handleRoomButtonClicked}
                >
                    Create A Room
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
    )
}
