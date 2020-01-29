import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, RouteProps } from 'react-router-dom';
import { useHasRole } from '../hooks/useHasRole';
import { useLoaderDelay } from '../hooks/useLoaderDelay';
import { AuthState, checkToken } from '../store/auth/authSlice';
import { RootState } from '../store/rootReducer';
import { Role } from '../store/user/userSlice';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
  ...props
}) => {
  const hasRoles = useHasRole();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const showLoader = useLoaderDelay(authState === AuthState.LOADING);

  useEffect(() => {
    if (authState === AuthState.LOGGED_OUT) {
      dispatch(checkToken());
    }
  }, [authState, dispatch]);

  if (authState === AuthState.LOADING) {
    return <>{showLoader && <div>Loading...</div>}</>;
  }

  if (
    (!requiredRoles || hasRoles(...requiredRoles)) &&
    authState === AuthState.LOGGED_IN
  ) {
    return <Route {...props} />;
  }

  return <div>Not Authorized</div>;
};

interface ProtectedRouteProps extends RouteProps {
  requiredRoles?: Role[];
}

export default ProtectedRoute;
