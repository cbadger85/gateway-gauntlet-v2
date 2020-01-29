import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLoaderDelay } from '../hooks/useLoaderDelay';
import { AuthState, checkToken, login } from '../store/auth/authSlice';
import { RootState } from '../store/rootReducer';

const Login: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const showLoader = useLoaderDelay(authState === AuthState.LOADING);

  if (authState === AuthState.LOGGED_IN) {
    history.push('/');
  }

  useEffect(() => {
    if (authState === AuthState.LOGGED_OUT) {
      dispatch(checkToken());
    }
  }, [authState, dispatch]);

  if (authState === AuthState.LOADING) {
    return <>{showLoader && <div>Loading...</div>}</>;
  }

  return (
    <div>
      <button onClick={() => dispatch(login('super-admin', 'password123'))}>
        Login
      </button>
    </div>
  );
};

export default Login;
