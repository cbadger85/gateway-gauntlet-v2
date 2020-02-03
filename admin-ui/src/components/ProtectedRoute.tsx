import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, RouteProps } from 'react-router-dom';
import { useHasRole } from '../hooks/useHasRole';
import { useLoaderDelay } from '../hooks/useLoaderDelay';
import { RootState } from '../store/rootReducer';
import { Role } from '../types/User';
import { Auth } from '../types/Auth';
import { checkToken } from '../store/auth/authSlice';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
  ...props
}) => {
  const hasRoles = useHasRole();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const showLoader = useLoaderDelay(auth === Auth.LOADING);

  useEffect(() => {
    if (auth === Auth.LOGGED_OUT) {
      dispatch(checkToken());
    }
  }, [auth, dispatch]);

  if (auth === Auth.LOADING) {
    return <>{showLoader && <div>Loading...</div>}</>;
  }

  if (
    (!requiredRoles || hasRoles(...requiredRoles)) &&
    auth === Auth.LOGGED_IN
  ) {
    return <Route {...props} />;
  }

  return <div>Not Authorized</div>;
};

interface ProtectedRouteProps extends RouteProps {
  requiredRoles?: Role[];
}

export default ProtectedRoute;
