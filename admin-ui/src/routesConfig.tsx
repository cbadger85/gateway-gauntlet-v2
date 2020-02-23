import { Role } from './types/User';
import React from 'react';
import ResetPassword from './pages/PasswordReset';
import Login from './pages/Login';
import { Redirect } from 'react-router-dom';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Tournaments from './pages/Tournaments';
import TournamentPage from './pages/TournamentPage';
import TournamentInfo from './pages/TournamentInfo';

const routesConfig = (
  options?: Partial<RouteConfigOptions>,
): Record<RouteKeys, RouteConfig> => ({
  home: {
    path: '/',
    protected: true,
    exact: true,
    component: () => <Redirect to={routesConfig().tournaments.path} />,
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
  tournamentPage: {
    path: `/tournaments/${options?.tournamentId || ':tournamentId'}`,
    name: 'tournament',
    protected: true,
    requiredRoles: [Role.ORGANIZER],
    component: TournamentPage,
  },
  tournamentInfo: {
    path: `/tournaments/${options?.tournamentId || ':tournamentId'}`,
    name: 'tournament info',
    component: TournamentInfo,
    menuType: 'leftPanel',
    exact: true,
  },
  players: {
    path: `/tournaments/${options?.tournamentId || ':tournamentId'}/players`,
    name: 'players',
    component: () => <div>Players</div>,
    menuType: 'leftPanel',
    exact: true,
  },
  tournamentManager: {
    path: `/tournaments/${options?.tournamentId || ':tournamentId'}/manager`,
    name: 'tournament manager',
    component: () => <div>Tournament Manager</div>,
    menuType: 'leftPanel',
    exact: true,
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
  | 'resetPassword'
  | 'tournamentInfo'
  | 'players'
  | 'tournamentManager';

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
