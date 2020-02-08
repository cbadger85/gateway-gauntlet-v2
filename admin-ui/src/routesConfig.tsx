import { Role } from './types/User';
import React from 'react';
import ResetPassword from './pages/PasswordReset';
import Login from './pages/Login';
import { Redirect } from 'react-router-dom';

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
  tournamentManager: {
    path: '/tournament-manager',
    name: 'tournament manager',
    protected: true,
    requiredRoles: [Role.ORGANIZER],
    component: () => <div>Tournament Manager</div>,
    menuType: 'navbar',
  },
  users: {
    path: '/users',
    name: 'users',
    protected: true,
    requiredRoles: [Role.ADMIN],
    component: () => <div>Users</div>,
    menuType: 'navbar',
  },
  profile: {
    path: '/profile',
    name: 'profile',
    exact: true,
    protected: true,
    component: () => <div>Profile</div>,
    menuType: 'navbar',
  },
});

export default routesConfig;

type RouteKeys =
  | 'users'
  | 'tournamentManager'
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
