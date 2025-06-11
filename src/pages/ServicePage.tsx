import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PhoneCall, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceById, fetchSettings } from '../services/apiService';
import { RestApiService, SiteSettings } from '../types/api';
import Contact from '../components/Contact';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Loader from '../components/Loader';
import { useAuth } from '../auth/useAuth';

const ServicePage: React.FC = () => {
	const navigate = useNavigate();
	const { serviceId } = useParams<{ serviceId: string }>();
	const { isLoggedIn } = useAuth();

	const {
		data: service,
		isLoading: isLoadingService,
		error: errorService,
	} = useQuery<RestApiService | null>({
		queryKey: ['service', serviceId],
		queryFn: () => {
			if (!serviceId) return Promise.resolve(null);
			return fetchServiceById(serviceId);
		},
		enabled: !!serviceId,
	});

	const { data: settings, isLoading: isLoadingSettings } =
		useQuery<SiteSettings | null>({
			queryKey: ['siteSettings'],
			queryFn: fetchSettings,
		});

	if (isLoadingService && !service) {
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center pt-24 md:pt-32'>
				<Loader size='xl' text='Загрузка услуги...' />
			</div>
		);
	}

	if (errorService) {
		console.error('Ошибка загрузки услуги:', errorService);
		return (
			<div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 pt-24 md:pt-32 text-center px-4'>
				<h2 className='text-3xl font-bold text-white mb-4'>
					Ошибка загрузки услуги
				</h2>
				<p className='text-gray-300 mb-6'>
					Не удалось загрузить данные об услуге. Пожалуйста, попробуйте
					позже.
				</p>
				<button
					onClick={() => navigate('/')}
					className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors'
				>
					Вернуться на главную
				</button>
			</div>
		);
	}

	if (!isLoadingService && !service) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 pt-24 md:pt-32 text-center px-4'>
				<h2 className='text-3xl font-bold text-white mb-4'>
					Услуга не найдена
				</h2>
				<p className='text-gray-300 mb-6'>
					Запрошенная услуга не существует или была удалена.
				</p>
				<button
					onClick={() => navigate('/')}
					className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors'
				>
					Вернуться на главную
				</button>
			</div>
		);
	}

	if (!service) {
		return null;
	}

	const phoneLink = settings?.phoneLink || '#';
	const whatsappLink = settings?.whatsappLink || '#';
	const displayAddress = settings?.address || 'Загрузка...';
	const displayWorkingHours = settings?.workingHours || '10:00-22:00';

	const backgroundImageUrl =
		service.images?.[0]?.urlSingle || '/img/img_2.png';

	return (
		<div className='pt-16 md:pt-24 bg-gray-900'>
			<div
				className='relative h-[50vh] flex items-end md:items-center bg-gray-700'
				style={{
					backgroundImage: `url(${backgroundImageUrl})`,
					backgroundPosition: 'center',
					backgroundSize: 'cover',
				}}
			>
				<div className='absolute inset-0 bg-black opacity-70'></div>
				<div className='container mx-auto px-4 relative z-10 pb-8 md:pb-0'>
					<div className='flex justify-between items-start mb-6'>
						<button
							onClick={() => navigate(-1)}
							className='flex items-center text-gray-300 hover:text-red-500 transition-colors'
						>
							<ArrowLeft size={20} className='mr-2' />
							Назад
						</button>
						{isLoggedIn && (
							<Link
								to={`/admin/services/${serviceId}/edit`}
								className='flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors'
							>
								<Edit size={16} className='mr-2' />
								Редактировать
							</Link>
						)}
					</div>
					<h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
						{service.name}
					</h1>
				</div>
			</div>

			<div className='container mx-auto px-4 py-16'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
					<div className='lg:col-span-2'>
						<h2 className='text-3xl font-bold text-white mb-6'>
							Об услуге
						</h2>

						<div className='text-lg mb-8'>
							<MarkdownRenderer content={service.description} />
						</div>
					</div>

					<div className='lg:sticky lg:top-28 self-start'>
						<div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
							<h3 className='text-xl font-semibold text-white mb-4'>
								Свяжитесь с нами
							</h3>
							<p className='text-gray-300 mb-6'>
								Для получения консультации или записи на сервис напишите
								нам в WhatsApp или позвоните.
							</p>
							{isLoadingSettings && !settings ? (
								<div className='space-y-4'>
									<div className='w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 rounded-md opacity-70 h-[48px]'>
										<Loader
											size='xs'
											spinnerClassName='border-white border-t-transparent'
										/>
									</div>
									<div className='w-full flex items-center justify-center bg-red-600 text-white font-semibold py-3 rounded-md opacity-70 h-[48px]'>
										<Loader
											size='xs'
											spinnerClassName='border-white border-t-transparent'
										/>
									</div>
								</div>
							) : (
								<>
									<a
										href={whatsappLink}
										target='_blank'
										rel='noopener noreferrer'
										className='block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-md mb-4 transition-colors flex items-center justify-center h-[48px]'
									>
										<MessageCircle className='mr-2' size={20} />
										Написать в WhatsApp
									</a>
									<a
										href={phoneLink}
										className='block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-3 rounded-md mb-4 transition-colors flex items-center justify-center h-[48px]'
									>
										<PhoneCall className='mr-2' size={20} />
										Позвонить
									</a>
								</>
							)}
							<div className='text-gray-400 text-sm mt-4'>
								<p className='mb-2'>Часы работы: {displayWorkingHours}</p>
								<p>Адрес: {displayAddress}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Contact />
		</div>
	);
};

export default ServicePage;
