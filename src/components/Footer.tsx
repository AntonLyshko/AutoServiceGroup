import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings, fetchServices } from '../services/apiService';
import { SiteSettings, TransformedService } from '../types/api';
import Loader from './Loader';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	const { data: settings, isLoading: isLoadingSettings } =
		useQuery<SiteSettings | null>({
			queryKey: ['siteSettings'],
			queryFn: fetchSettings,
		});

	const { data: services, isLoading: isLoadingServices } = useQuery<
		TransformedService[]
	>({
		queryKey: ['services'],
		queryFn: fetchServices,
	});

	const phoneLink = settings?.phoneLink || '#';
	const displayPhone = settings?.phoneNumber || 'Загрузка...';
	const displayAddress = settings?.address || 'Загрузка...';
	const displayWorkingHours = settings?.workingHours || '10:00-22:00';
	const footerServices = services?.slice(0, 6) || [];

	return (
		<footer className='bg-gray-950 text-white'>
			<div className='container mx-auto px-4 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div>
						<Link
							to='/'
							className='text-2xl font-bold flex items-center mb-4'
						>
							<span className='text-red-600'>ТрейдАвто</span>-групп
						</Link>
						<p className='text-gray-400 mb-6'>
							Профессиональный ремонт и обслуживание автомобилей любых
							марок с использованием современного оборудования
						</p>
					</div>

					<div>
						<h3 className='text-xl font-semibold mb-4 text-white'>
							Услуги
						</h3>
						{isLoadingServices ? (
							<div className='space-y-2'>
								{[...Array(6)].map((_, i) => (
									<div
										key={i}
										className='h-5 bg-gray-700 rounded w-3/4 animate-pulse'
									/>
								))}
							</div>
						) : (
							<ul className='space-y-2'>
								{footerServices.map((service) => (
									<li key={service.id}>
										<Link
											to={`/services/${service.id}`}
											className='text-gray-400 hover:text-red-500 transition-colors'
										>
											{service.title}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>

					<div>
						<h3 className='text-xl font-semibold mb-4 text-white'>
							Контакты
						</h3>
						{isLoadingSettings && !settings ? (
							<div className='space-y-4 min-h-[100px] flex items-center'>
								<Loader size='sm' text='Загрузка контактов...' />
							</div>
						) : (
							<div className='space-y-4'>
								<div className='flex items-center'>
									<PhoneCall size={20} className='text-red-500 mr-3' />
									<a
										href={phoneLink}
										className='text-gray-400 hover:text-red-500 transition-colors'
									>
										{displayPhone}
									</a>
								</div>
								<div className='flex items-center'>
									<Clock size={20} className='text-red-500 mr-3' />
									<span className='text-gray-400'>
										{displayWorkingHours}
									</span>
								</div>
								<div className='flex items-start'>
									<MapPin size={20} className='text-red-500 mr-3 mt-1' />
									<span className='text-gray-400'>{displayAddress}</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='border-t border-gray-800 mt-12 pt-6 text-center'>
					<p className='text-gray-500'>
						© {currentYear} ТрейдАвто-групп. Все права защищены.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
