import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { LoadingDataPage } from '../pages/LoadingPages/LoadingDataPage';

export const ProtectedRoute = ({ adminOnly = false, redirectPath = '/404' }) => {
    const { user, isLoading } = useUser();
    if (isLoading) {
        return <LoadingDataPage />;
    }
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }
    if (adminOnly && !user.admin) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};