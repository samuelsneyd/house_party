import React, {Component} from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';
import JoinRoomPage from './JoinRoomPage';
import CreateRoomPage from './CreateRoomPage';
import { BrowserRouter, Link, Redirect } from 'react-router-dom';
import { Routes, Route } from 'react-router';

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<HomePage />}>
                    <Route path="join" element={<JoinRoomPage />} />
                    <Route path="create" element={<CreateRoomPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

const appDiv = document.getElementById('app');
render(<App/>, appDiv);

