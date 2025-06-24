import { createContext, useContext, lazy } from 'react';
const LandingPage = lazy(() => import('../pages/LandingPage'));
const GeneralPage = lazy(() => import('../pages/GeneralPage'));
const Users = lazy(() => import('../pages/DataPage/Users').then(m => ({ default: m.Users })));
const ItemPage = lazy(() => import('../pages/DataPage/ItemPage').then(m => ({ default: m.ItemPage })));
const OtherItemPage = lazy(() => import('../pages/DataPage/OtherItemPage').then(m => ({ default: m.OtherItemPage })));
const UserProfile = lazy(() => import('../pages/UserProfile').then(m => ({ default: m.UserProfile })));

import { LoadingDataPage } from '../pages/LoadingPages/LoadingDataPage';
import { LoadingGeneralPage } from '../pages/LoadingPages/LoadingGeneralPage';

const routeList = Object.freeze([
  {
    name: 'home',
    path: '/',
    component: LandingPage,
    visibleTo: ['guest'],
    icon: 'house',
    label: 'Back to home',
    loader: null
  },
  {
    name: 'search',
    path: '/search',
    component: GeneralPage,
    visibleTo: ['guest'],
    icon: 'package',
    label: 'Search a delivery',
    loader: <LoadingGeneralPage />
  },
  {
    name: 'users',
    path: '/users',
    component: Users,
    visibleTo: ['admin'],
    icon: 'user-round',
    label: 'Users',
    loader: <LoadingDataPage />
  },
  {
    name: 'itemPage',
    path: '/itemPage',
    component: ItemPage,
    visibleTo: ['user'],
    icon: 'file',
    label: 'Item page',
    loader: <LoadingDataPage />
  },
  {
    name: 'otherItemPage',
    path: '/otherItemPage',
    component: OtherItemPage,
    visibleTo: ['user'],
    icon: 'truck',
    label: 'Other item page',
    loader: <LoadingDataPage />
  },
  {
    name: 'userProfile',
    path: '/profile',
    component: UserProfile,
    visibleTo: ['user'],
    icon: 'user-round-cog',
    label: 'Manage account',
    loader: null
  }
]);

const RoutesContext = createContext(routeList);

export const useRoutes = () => useContext(RoutesContext);

export const RoutesProvider = ({ children }) => {
  return (
    <RoutesContext.Provider value={routeList}>
      {children}
    </RoutesContext.Provider>
  );
};