import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/auth/authSlice';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      Homepage
      <div>
        <Link to="/login">Login Page</Link>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </div>
  );
};

export default Homepage;
