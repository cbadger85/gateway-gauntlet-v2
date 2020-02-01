import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLoaderDelay } from '../hooks/useLoaderDelay';
import { checkToken, login } from '../store/auth/authSlice';
import { RootState } from '../store/rootReducer';
import { Auth } from '../types/Auth';

const Login: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const showLoader = useLoaderDelay(auth === Auth.LOADING);

  if (auth === Auth.LOGGED_IN) {
    history.push('/');
  }

  useEffect(() => {
    if (auth === Auth.LOGGED_OUT) {
      dispatch(checkToken());
    }
  }, [auth, dispatch]);

  if (auth === Auth.LOADING) {
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
