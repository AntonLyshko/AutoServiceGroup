import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, Clock, MapPin, Car } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchServices, fetchGeneralData } from '../services/apiService';
import { TransformedService, TransformedGeneralData } from '../types/api';
import {
	formatDisplayPhoneNumber,
	formatPhoneNumberForTelLink,
} from '../lib/utils';
import Loader from './Loader'; // Импорт Loader

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	const { data: servicesData, isLoading: isLoadingServices } = useQuery<
		TransformedService[]
	>({
		queryKey: ['services'],
		queryFn: fetchServices,
	});

	const { data: generalData, isLoading: isLoadingGeneral } =
		useQuery<TransformedGeneralData | null>({
			queryKey: ['generalData'],
			queryFn: fetchGeneralData,
		});

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [scrolled]);

	useEffect(() => {
		closeMenu();
	}, [location.pathname, location.hash]);

	const toggleMenu = () => setIsOpen(!isOpen);
	const closeMenu = () => setIsOpen(false);

	const handleNavClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		hash: string
	) => {
		closeMenu();
		if (location.pathname === '/' && hash) {
			e.preventDefault();
			const element = document.getElementById(hash.substring(1));
			element?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const navServices =
		servicesData?.filter((service) => service.id !== 'why-choose-us') ||
		[];

	const rawPhone = generalData?.phone || '+7 965 511 8585';
	const displayPhoneFormatted = formatDisplayPhoneNumber(rawPhone);
	const telLinkPhone = formatPhoneNumberForTelLink(rawPhone);

	const displayAddress =
		generalData?.address || 'Березовский, Транспортников 42А';

	return (
		<header
			className={`fixed w-full z-50 transition-all duration-300 ${
				scrolled
					? 'bg-gray-900/95 backdrop-blur-sm shadow-lg'
					: 'bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-transparent'
			}`}
		>
			<div className='container mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<Link
						to='/'
						className='text-2xl font-bold text-white flex items-center'
						onClick={closeMenu}
					>
						ТрейдАвто<span className='text-red-600'>-групп</span>
					</Link>
					<div className='flex items-center space-x-4'>
						<div className='hidden md:flex items-center space-x-6 text-gray-300'>
							<div className='flex items-center h-5'>
								{' '}
								{/* Задать высоту для выравнивания */}
								<PhoneCall size={18} className='mr-2 text-red-500' />
								{isLoadingGeneral && !generalData ? (
									<Loader
										size='xs'
										spinnerClassName='border-gray-300 border-t-transparent'
									/>
								) : (
									<a
										href={`tel:${telLinkPhone}`}
										className='hover:text-red-500 transition-colors text-sm lg:text-base'
									>
										{displayPhoneFormatted}
									</a>
								)}
							</div>
							<div className='flex items-center h-5'>
								{' '}
								{/* Задать высоту для выравнивания */}
								<MapPin size={18} className='mr-2 text-red-500' />
								{isLoadingGeneral && !generalData ? (
									<Loader
										size='xs'
										spinnerClassName='border-gray-300 border-t-transparent'
									/>
								) : (
									<span className='text-sm lg:text-base'>
										{displayAddress}
									</span>
								)}
							</div>
						</div>
						<button
							className='md:hidden text-white focus:outline-none'
							onClick={toggleMenu}
							aria-label='Toggle menu'
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				<hr
					className={`border-gray-700/50 hidden md:block ${
						scrolled ? '' : 'opacity-0'
					}`}
				/>

				<nav className='hidden md:flex items-center justify-start flex-wrap py-2 gap-x-3 lg:gap-x-4 min-h-[36px]'>
					{' '}
					{/* min-h для стабильности */}
					{isLoadingServices && !navServices.length ? (
						<div className='flex items-center h-[36px] py-2'>
							<Loader
								size='sm'
								text='Загрузка меню...'
								textColor='text-gray-400'
							/>
						</div>
					) : (
						<>
							{navServices.map((service) => (
								<Link
									key={service.id}
									to={`/services/${service.id}`}
									className='text-gray-300 hover:text-red-500 transition-colors text-sm lg:text-base whitespace-nowrap py-1 px-1 font-semibold'
								>
									{service.title}
								</Link>
							))}
						</>
					)}
					<Link
						to='/gallery'
						className='text-gray-300 hover:text-red-500 transition-colors text-sm lg:text-base whitespace-nowrap py-1 px-1 font-semibold'
					>
						Наши работы
					</Link>
					<Link
						to='/#cars-for-sale'
						onClick={(e) => handleNavClick(e, '#cars-for-sale')}
						className='text-gray-300 hover:text-red-500 transition-colors text-sm lg:text-base whitespace-nowrap py-1 px-1 font-semibold flex items-center'
					>
						<Car size={18} className='mr-1.5 text-red-500' />
						Авто на продажу
					</Link>
					<Link
						to='/#contact'
						onClick={(e) => handleNavClick(e, '#contact')}
						className='text-gray-300 hover:text-red-500 transition-colors text-sm lg:text-base whitespace-nowrap py-1 px-1 font-semibold'
					>
						Контакты
					</Link>
				</nav>
				{!isLoadingServices &&
					navServices.length === 0 && ( // Если загрузка завершена и услуг нет
						<div className='hidden md:block h-[36px] py-2'></div>
					)}
			</div>

			<div
				className={`md:hidden fixed inset-0 bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<button
					className='absolute top-6 right-5 text-white focus:outline-none'
					onClick={closeMenu}
					aria-label='Close menu'
				>
					<X size={28} />
				</button>
				<div className='flex flex-col h-full overflow-y-auto py-20 px-4 space-y-4'>
					<h3 className='text-xl font-semibold text-white border-b border-gray-700 pb-2'>
						Услуги
					</h3>
					<div className='flex flex-col space-y-3 pl-2 min-h-[60px]'>
						{' '}
						{/* min-h */}
						{isLoadingServices && !navServices.length ? (
							<Loader
								size='sm'
								text='Загрузка услуг...'
								textColor='text-gray-400'
							/>
						) : (
							navServices.map((service) => (
								<Link
									key={service.id}
									to={`/services/${service.id}`}
									className='block text-gray-300 hover:text-red-500 transition-colors text-lg'
									onClick={closeMenu}
								>
									{service.title}
								</Link>
							))
						)}
					</div>
					<Link
						to='/gallery'
						className='text-xl text-white hover:text-red-500 transition-colors pt-2 border-t border-gray-700 mt-4'
						onClick={closeMenu}
					>
						Наши работы
					</Link>
					<Link
						to='/#cars-for-sale'
						onClick={(e) => handleNavClick(e, '#cars-for-sale')}
						className='text-xl text-white hover:text-red-500 transition-colors pt-2 flex items-center'
					>
						<Car size={22} className='mr-2 text-red-500' />
						Авто на продажу
					</Link>
					<Link
						to='/#contact'
						onClick={(e) => handleNavClick(e, '#contact')}
						className='text-xl text-white hover:text-red-500 transition-colors pt-2'
					>
						Контакты
					</Link>
					<div className='mt-auto pt-6 border-t border-gray-700 space-y-4 min-h-[120px]'>
						{' '}
						{/* min-h */}
						{isLoadingGeneral && !generalData ? (
							<div className='flex justify-center pt-4'>
								<Loader
									size='sm'
									text='Загрузка контактов...'
									textColor='text-gray-400'
								/>
							</div>
						) : (
							<>
								<div className='flex items-center text-white'>
									<PhoneCall size={20} className='mr-3 text-red-500' />
									<a href={`tel:${telLinkPhone}`} className='text-lg'>
										{displayPhoneFormatted}
									</a>
								</div>
								<div className='flex items-center text-white'>
									<Clock size={20} className='mr-3 text-red-500' />
									<span className='text-lg'>10:00-22:00</span>
								</div>
								<div className='flex items-start text-white'>
									<MapPin size={20} className='mr-3 text-red-500 mt-1' />
									<span className='text-lg'>{displayAddress}</span>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
