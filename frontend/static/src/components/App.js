import React from 'react';
import { render } from 'react-dom';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';
import HomePage from './HomePage';
import JoinRoomPage from './JoinRoomPage';
import Room from './Room';

export default function App() {
  return (
    <div className='center'>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<HomePage/>}/>
          <Route path='join' element={<JoinRoomPage/>}/>
          <Route path='create' element={<CreateRoomPage/>}/>
          <Route path='room/:roomCode' element={<Room/>}/>
          <Route
            path='*'
            element={
              <main style={{ padding: '1rem' }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const appDiv = document.getElementById('app');
render(<App/>, appDiv);

