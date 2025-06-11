import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import {
	Settings,
	Car,
	Wrench,
	GalleryHorizontal,
	LogOut,
	Home,
} from 'lucide-react';

const AdminHeader = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const getLinkClass = (path: string) => {
		const baseClass =
			'flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors';
		const activeClass = 'bg-red-600 text-white';

		// Проверяем, начинается ли текущий путь с пути ссылки
		if (location.pathname.startsWith(path)) {
			return `${baseClass} ${activeClass}`;
		}
		return baseClass;
	};

	return (
		<header className='bg-gray-800 text-white shadow-md sticky top-0 z-50'>
			<div className='container mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<Link
						to='/admin/settings'
						className='text-xl font-bold text-white'
					>
						Админ-панель
					</Link>
					<nav className='flex items-center space-x-2 md:space-x-4'>
						<NavLink
							to='/admin/settings'
							className={({ isActive }) =>
								`flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors ${
									isActive ? 'bg-red-600 text-white' : ''
								}`
							}
						>
							<Settings size={18} className='mr-2' />
							<span className='hidden md:inline'>Настройки</span>
						</NavLink>
						{/* Ссылки теперь ведут на страницы списков */}
						<Link to='/admin/cars' className={getLinkClass('/admin/cars')}>
							<Car size={18} className='mr-2' />
							<span className='hidden md:inline'>Авто</span>
						</Link>
						<Link
							to='/admin/services'
							className={getLinkClass('/admin/services')}
						>
							<Wrench size={18} className='mr-2' />
							<span className='hidden md:inline'>Услуги</span>
						</Link>
						<Link
							to='/admin/work-examples'
							className={getLinkClass('/admin/work-examples')}
						>
							<GalleryHorizontal size={18} className='mr-2' />
							<span className='hidden md:inline'>Работы</span>
						</Link>
						<div className='border-l border-gray-600 h-8 mx-2'></div>
						<a
							href='/'
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors'
							title='Открыть сайт'
						>
							<Home size={18} />
						</a>
						<button
							onClick={handleLogout}
							className='flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors'
							title='Выйти'
						>
							<LogOut size={18} />
						</button>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default AdminHeader;
