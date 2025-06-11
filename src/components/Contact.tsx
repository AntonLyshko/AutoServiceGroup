import React from 'react';
import { PhoneCall, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../services/apiService';
import { SiteSettings } from '../types/api';
import Loader from './Loader';

const Contact = () => {
	const { data: settings, isLoading: isLoadingSettings } =
		useQuery<SiteSettings | null>({
			queryKey: ['siteSettings'],
			queryFn: fetchSettings,
		});

	const phoneLink = settings?.phoneLink || '#';
	const displayPhone = settings?.phoneNumber || 'Загрузка...';
	const displayAddress = settings?.address || 'Загрузка...';
	const displayWorkingHours = settings?.workingHours || '10:00-22:00';

	const encodedAddress = encodeURIComponent(
		displayAddress || 'Березовский, Транспортников 42А'
	);
	const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2181.6180769263375!2d60.8088433!3d56.911438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43c16ef7c6fa7b47%3A0xa7e554c1ab3edbd8!2z0YPQuy4g0KLRgNCw0L3RgdC_0L7RgNGC0L3QuNC60L7QsiwgNDLQkCwg0JHQtdGA0ZHQt9C-0LLRgdC60LjQuSwg0KHQstC10YDQtNC70L7QstGB0LrQsNGPINC-0LHQuy4sIDYyMzcwMg!5e0!3m2!1sru!2sru!4v1716915066364!5m2!1sru!2sru&q=${encodedAddress}`;

	return (
		<section id='contact' className='py-20 bg-gray-900'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Контакты
					</h2>
					<p className='text-gray-400 max-w-2xl mx-auto'>
						Свяжитесь с нами или приезжайте прямо сейчас, чтобы получить
						консультацию по ремонту и обслуживанию вашего автомобиля
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
					<div className='bg-gray-800 p-8 rounded-lg shadow-lg'>
						<h3 className='text-2xl font-bold text-white mb-6'>
							Наши контакты
						</h3>
						{isLoadingSettings && !settings ? (
							<div className='space-y-6 flex justify-center items-center min-h-[200px]'>
								<Loader size='md' text='Загрузка контактов...' />
							</div>
						) : (
							<div className='space-y-6'>
								<div className='flex items-start'>
									<div className='bg-red-600 p-3 rounded-full mr-4'>
										<PhoneCall size={24} className='text-white' />
									</div>
									<div>
										<h4 className='text-lg font-semibold text-white'>
											Телефон
										</h4>
										<a
											href={phoneLink}
											className='text-gray-300 hover:text-red-500 transition-colors'
										>
											{displayPhone}
										</a>
									</div>
								</div>

								<div className='flex items-start'>
									<div className='bg-red-600 p-3 rounded-full mr-4'>
										<Clock size={24} className='text-white' />
									</div>
									<div>
										<h4 className='text-lg font-semibold text-white'>
											Часы работы
										</h4>
										<p className='text-gray-300'>{displayWorkingHours}</p>
									</div>
								</div>

								<div className='flex items-start'>
									<div className='bg-red-600 p-3 rounded-full mr-4'>
										<MapPin size={24} className='text-white' />
									</div>
									<div>
										<h4 className='text-lg font-semibold text-white'>
											Адрес
										</h4>
										<p className='text-gray-300'>{displayAddress}</p>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className='h-[400px] rounded-lg overflow-hidden shadow-lg'>
						{isLoadingSettings && !settings ? (
							<div className='w-full h-full flex items-center justify-center bg-gray-700'>
								<Loader size='lg' text='Загрузка карты...' />
							</div>
						) : (
							<iframe
								src={mapSrc}
								width='100%'
								height='100%'
								style={{ border: 0 }}
								allowFullScreen
								loading='lazy'
								referrerPolicy='no-referrer-when-downgrade'
								title='Auto Service location'
							></iframe>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
