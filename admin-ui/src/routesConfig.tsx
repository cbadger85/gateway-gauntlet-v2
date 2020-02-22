import { Role } from './types/User';
import React from 'react';
import ResetPassword from './pages/PasswordReset';
import Login from './pages/Login';
import { Redirect } from 'react-router-dom';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Tournaments from './pages/Tournaments';

const routesConfig = (
  options?: Partial<RouteConfigOptions>,
): Record<RouteKeys, RouteConfig> => ({
  home: {
    path: '/',
    protected: true,
    exact: true,
    component: () => <Redirect to="/tournament-manager" />,
  },
  login: {
    path: '/login',
    exact: true,
    component: Login,
  },
  resetPassword: {
    path: '/users/:userId/password/:passwordResetId/reset',
    exact: true,
    component: ResetPassword,
  },
  tournaments: {
    path: '/tournaments',
    name: 'tournaments',
    protected: true,
    requiredRoles: [Role.ORGANIZER],
    component: Tournaments,
    menuType: 'navbar',
    exact: true,
  },
  tournamentPage: {
    path: options?.tournamentId
      ? `/tournament-manager/${options.tournamentId}`
      : '/tournament-manager/:tournamentId',
    name: 'tournament',
    protected: true,
    requiredRoles: [Role.ORGANIZER],
    component: () => <div>Tournament</div>,
  },
  users: {
    path: '/users',
    name: 'users',
    protected: true,
    requiredRoles: [Role.ADMIN],
    component: Users,
    menuType: 'navbar',
  },
  profile: {
    path: '/profile',
    name: 'profile',
    exact: true,
    protected: true,
    component: Profile,
    menuType: 'navbar',
  },
});

export default routesConfig;

type RouteKeys =
  | 'users'
  | 'tournaments'
  | 'tournamentPage'
  | 'profile'
  | 'login'
  | 'home'
  | 'resetPassword';

interface RouteConfig {
  path: string;
  component: React.FC;
  protected?: boolean;
  exact?: boolean;
  name?: string;
  requiredRoles?: Role[];
  menuType?: 'navbar' | 'leftPanel';
}

interface RouteConfigOptions {
  tournamentId: string;
  userId: string;
  playerId: string;
}
