import React, {Component} from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';
import JoinRoomPage from './JoinRoomPage';
import CreateRoomPage from './CreateRoomPage';
import { BrowserRouter, Link, Redirect } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import Room from './Room';

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/*<Route path="join" element={<JoinRoomPage />} />*/}
                    {/*<Route path="create" element={<CreateRoomPage />} />*/}
                    {/*<Route path='room/:roomCode' element={<Room />} />*/}
                </Routes>
            </BrowserRouter>
        );
    }
}

const appDiv = document.getElementById('app');
render(<HomePage/>, appDiv);

