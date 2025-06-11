import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

interface ProtectedRouteProps {
	children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isLoggedIn } = useAuth();
	const location = useLocation();

	if (!isLoggedIn) {
		// Сохраняем путь, на который пользователь пытался перейти
		return (
			<Navigate to='/admin/login' state={{ from: location }} replace />
		);
	}

	return children;
};

export default ProtectedRoute;
