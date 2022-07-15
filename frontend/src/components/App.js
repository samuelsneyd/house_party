import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import Home from './Home';
import JoinRoom from './JoinRoom';
import Room from './Room';

const App = () => {
  return (
    <div className="center">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="join" element={<JoinRoom />} />
          <Route path="create" element={<CreateRoom />} />
          <Route path="room/:roomCode" element={<Room />} />
          <Route
            path="*"
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
};

export default App;
