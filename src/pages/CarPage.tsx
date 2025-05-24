import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	ArrowLeft,
	PhoneCall,
	MessageCircle,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCarById, fetchGeneralData } from '../services/apiService';
import {
	TransformedCarPageData,
	TransformedGeneralData,
} from '../types/api';
import StrapiRichTextRenderer from '../components/StrapiRichTextRenderer';
import Contact from '../components/Contact';
import { formatPhoneNumberForTelLink } from '../lib/utils'; // Импортируем форматер для tel: ссылок

const CarPage: React.FC = () => {
	const navigate = useNavigate();
	const { carId } = useParams<{ carId: string }>();

	const {
		data: car,
		isLoading: isLoadingCar,
		error: errorCar,
	} = useQuery<TransformedCarPageData | null>({
		queryKey: ['carPageData', carId],
		queryFn: () => {
			if (!carId) return Promise.resolve(null);
			return fetchCarById(carId);
		},
		enabled: !!carId,
	});

	const { data: generalData, isLoading: isLoadingGeneral } =
		useQuery<TransformedGeneralData | null>({
			queryKey: ['generalData'],
			queryFn: fetchGeneralData,
		});

	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

	useEffect(() => {
		setCurrentImageIndex(0);
	}, [carId]);

	const mainImage = car?.images[currentImageIndex]?.url;
	const totalImages = car?.images?.length || 0;

	const goToNextImage = useCallback(() => {
		if (totalImages > 0) {
			setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
		}
	}, [totalImages]);

	const goToPrevImage = useCallback(() => {
		if (totalImages > 0) {
			setCurrentImageIndex(
				(prevIndex) => (prevIndex - 1 + totalImages) % totalImages
			);
		}
	}, [totalImages]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!car || totalImages <= 1) return;

			if (event.key === 'ArrowRight') {
				goToNextImage();
			} else if (event.key === 'ArrowLeft') {
				goToPrevImage();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [car, totalImages, goToNextImage, goToPrevImage]);

	if (isLoadingCar) {
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center pt-24 md:pt-32'>
				Загрузка информации об автомобиле...
			</div>
		);
	}

	if (errorCar || !car) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 pt-24 md:pt-32 text-center'>
				<h2 className='text-3xl font-bold text-white mb-4'>
					{errorCar ? 'Ошибка загрузки' : 'Автомобиль не найден'}
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

	const handleThumbnailClick = (index: number) => {
		setCurrentImageIndex(index);
	};

	const rawPhone = generalData?.phone || '+7 965 511 8585';
	const telLinkPhone = formatPhoneNumberForTelLink(rawPhone); // Форматируем для tel: ссылки

	const whatsAppNumber = generalData?.whatsappPhone || '79655118585'; // generalData.whatsappPhone уже отформатирован в apiService
	const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

	return (
		<div className='pt-16 md:pt-24 bg-gray-900 text-white'>
			<div className='container mx-auto px-4 py-12 md:py-16'>
				<button
					onClick={() => navigate(-1)}
					className='mb-8 flex items-center text-gray-300 hover:text-red-500 transition-colors'
				>
					<ArrowLeft size={20} className='mr-2' />
					Назад
				</button>

				<div className='grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12'>
					<div className='lg:col-span-3'>
						<div className='relative aspect-w-16 aspect-h-10 md:aspect-h-9 bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-4'>
							{mainImage ? (
								<img
									src={mainImage}
									alt={`${car.title} - изображение ${
										currentImageIndex + 1
									}`}
									className='w-full h-full object-contain'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-500'>
									{totalImages > 0 ? 'Загрузка...' : 'Нет изображений'}
								</div>
							)}

							{totalImages > 1 && (
								<>
									<button
										onClick={goToPrevImage}
										className='absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10'
										aria-label='Предыдущее изображение'
									>
										<ChevronLeft size={28} />
									</button>
									<button
										onClick={goToNextImage}
										className='absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10'
										aria-label='Следующее изображение'
									>
										<ChevronRight size={28} />
									</button>
								</>
							)}
						</div>
						{totalImages > 1 && (
							<div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3'>
								{car.images.map((image, index) => (
									<button
										key={image.url + index}
										onClick={() => handleThumbnailClick(index)}
										className={`aspect-w-1 aspect-h-1 bg-gray-800 rounded overflow-hidden cursor-pointer transition-opacity hover:opacity-80
                                        ${
																					index === currentImageIndex
																						? 'ring-2 ring-red-500 opacity-100'
																						: 'opacity-60'
																				}`}
										aria-label={`Показать изображение ${index + 1}`}
									>
										<img
											src={image.url}
											alt={`${car.title} - миниатюра ${index + 1}`}
											className='w-full h-full object-cover'
										/>
									</button>
								))}
							</div>
						)}
					</div>

					<div className='lg:col-span-2'>
						<h1 className='text-3xl md:text-4xl font-bold text-white mb-3'>
							{car.title}
						</h1>
						<p className='text-3xl md:text-4xl font-bold text-red-500 mb-6'>
							{car.cost}
						</p>

						{isLoadingGeneral ? (
							<div className='space-y-4 mb-8'>
								<div className='w-full flex items-center justify-center bg-red-600 text-white font-semibold py-3 px-6 rounded-md opacity-50'>
									Загрузка...
								</div>
								<div className='w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-6 rounded-md opacity-50'>
									Загрузка...
								</div>
							</div>
						) : (
							<div className='space-y-4 mb-8'>
								<a
									href={`tel:${telLinkPhone}`} // Используем отформатированный номер для tel: ссылки
									className='w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300'
								>
									<PhoneCall size={20} className='mr-2' />
									Позвонить
								</a>
								<a
									href={whatsAppLink}
									target='_blank'
									rel='noopener noreferrer'
									className='w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300'
								>
									<MessageCircle size={20} className='mr-2' />
									Написать в WhatsApp
								</a>
							</div>
						)}

						<div className='prose prose-invert max-w-none text-gray-300 text-lg'>
							<h2 className='text-2xl font-semibold text-white mb-3'>
								Описание
							</h2>
							{car.descriptionObject &&
							car.descriptionObject.length > 0 ? (
								<StrapiRichTextRenderer content={car.descriptionObject} />
							) : (
								<p>Подробное описание отсутствует.</p>
							)}
						</div>
					</div>
				</div>
			</div>
			<Contact />
		</div>
	);
};

export default CarPage;
