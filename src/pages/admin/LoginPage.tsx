import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
	const { login, isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/admin/settings';

	useEffect(() => {
		if (isLoggedIn) {
			navigate(from, { replace: true });
		}
	}, [isLoggedIn, navigate, from]);

	const handleLogin = () => {
		const password = prompt('Пожалуйста, введите пароль администратора:');
		if (password !== null) {
			if (login(password)) {
				navigate(from, { replace: true });
			}
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center'>
			<div className='text-center p-8 bg-gray-800 rounded-lg shadow-xl'>
				<h1 className='text-3xl font-bold mb-4 text-red-500'>
					Вход в панель администратора
				</h1>
				<p className='text-gray-300 mb-8'>
					Для доступа к этому разделу требуется аутентификация.
				</p>
				<button
					onClick={handleLogin}
					className='w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300'
				>
					<LogIn size={20} className='mr-2' />
					Войти
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
