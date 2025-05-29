import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PhoneCall } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
	fetchServiceBySlug,
	fetchGeneralData,
} from '../services/apiService';
import { TransformedService, TransformedGeneralData } from '../types/api';
import Contact from '../components/Contact';
import StrapiRichTextRenderer from '../components/StrapiRichTextRenderer';
import { formatPhoneNumberForTelLink } from '../lib/utils';
import Loader from '../components/Loader';

const ServicePage: React.FC = () => {
	const navigate = useNavigate();
	const { serviceSlug } = useParams<{ serviceSlug: string }>();

	const {
		data: service,
		isLoading: isLoadingService,
		error: errorService,
	} = useQuery<TransformedService | null>({
		queryKey: ['service', serviceSlug],
		queryFn: () => {
			if (!serviceSlug) return Promise.resolve(null);
			return fetchServiceBySlug(serviceSlug);
		},
		enabled: !!serviceSlug,
	});

	const { data: generalData, isLoading: isLoadingGeneral } =
		useQuery<TransformedGeneralData | null>({
			queryKey: ['generalData'],
			queryFn: fetchGeneralData,
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
		// Этот return защищает от ошибок TypeScript ниже
		return (
			<div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 pt-24 md:pt-32 text-center px-4'>
				<h2 className='text-3xl font-bold text-white mb-4'>
					Данные об услуге отсутствуют
				</h2>
				<button
					onClick={() => navigate('/')}
					className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors'
				>
					Вернуться на главную
				</button>
			</div>
		);
	}

	const rawPhone = generalData?.phone || '+7 965 511 8585';
	const telLinkPhone = formatPhoneNumberForTelLink(rawPhone);

	const displayAddress =
		generalData?.address || 'Березовский, Транспортников 42А';
	const whatsAppNumber = generalData?.whatsappPhone || '79655118585';
	const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

	return (
		<div className='pt-16 md:pt-24 bg-gray-900'>
			<div
				className='relative h-[50vh] flex items-center bg-gray-700'
				style={{
					backgroundImage: `url(${service.imageUrl})`,
					backgroundPosition: 'center',
					backgroundSize: 'cover',
				}}
			>
				<div className='absolute inset-0 bg-black opacity-70'></div>
				<div className='container mx-auto px-4 relative z-10'>
					<button
						onClick={() => navigate(-1)}
						className='mb-6 flex items-center text-gray-300 hover:text-red-500 transition-colors'
					>
						<ArrowLeft size={20} className='mr-2' />
						Назад
					</button>
					<h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
						{service.title}
					</h1>
				</div>
			</div>

			<div className='container mx-auto px-4 py-16'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
					<div className='lg:col-span-2'>
						<h2 className='text-3xl font-bold text-white mb-6'>
							Об услуге
						</h2>

						<div className='prose prose-invert max-w-none text-gray-300 text-lg mb-8'>
							{service.fullDescriptionObject && (
								<StrapiRichTextRenderer
									content={service.fullDescriptionObject}
								/>
							)}
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
							{isLoadingGeneral && !generalData ? (
								<div className='space-y-4'>
									<div className='block w-full bg-green-600 text-white text-center font-semibold py-3 rounded-md opacity-70 h-[48px] flex items-center justify-center'>
										<Loader
											size='xs'
											spinnerClassName='border-white border-t-transparent'
										/>
									</div>
									<div className='block w-full bg-red-600 text-white text-center font-semibold py-3 rounded-md opacity-70 h-[48px] flex items-center justify-center'>
										<Loader
											size='xs'
											spinnerClassName='border-white border-t-transparent'
										/>
									</div>
								</div>
							) : (
								<>
									<a
										href={whatsAppLink}
										target='_blank'
										rel='noopener noreferrer'
										className='block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-md mb-4 transition-colors flex items-center justify-center h-[48px]'
									>
										<MessageCircle className='mr-2' size={20} />
										Написать в WhatsApp
									</a>
									<a
										href={`tel:${telLinkPhone}`}
										className='block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-3 rounded-md mb-4 transition-colors flex items-center justify-center h-[48px]'
									>
										<PhoneCall className='mr-2' size={20} />
										Позвонить
									</a>
								</>
							)}
							<div className='text-gray-400 text-sm mt-4'>
								<p className='mb-2'>Часы работы: 10:00-22:00</p>
								{isLoadingGeneral && !generalData ? (
									<div className='flex items-center h-5'>
										<Loader
											size='xs'
											spinnerClassName='border-gray-400 border-t-transparent'
										/>
										<span className='ml-2'>Загрузка адреса...</span>
									</div>
								) : (
									<p>Адрес: {displayAddress}</p>
								)}
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
