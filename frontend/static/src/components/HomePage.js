import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import CreateRoomPage from './CreateRoomPage';
import JoinRoomPage from './JoinRoomPage';
import Room from './Room';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    {/*<Route exact path='/'><p>This is the home page.</p></Route>*/}
                    <Route path='join' element={<JoinRoomPage />} />
                    <Route path='create' element={<CreateRoomPage />} />
                    <Route path='room' element={<Room />} />>
                    <Route path='room/:roomCode' element={<Room />} />
                    <Route
                      path="*"
                      element={
                        <main style={{ padding: "1rem" }}>
                          <p>There's nothing here!</p>
                        </main>
                      }
                    />
                </Routes>
            </BrowserRouter>
        );
    }
}
