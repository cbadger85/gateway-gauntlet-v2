import React from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/auth/authSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div className="App">
      <button onClick={() => dispatch(login('super-admin', 'password123'))}>
        Login
      </button>

      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default App;
