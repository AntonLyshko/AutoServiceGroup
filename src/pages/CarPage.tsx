import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
	ArrowLeft,
	PhoneCall,
	MessageCircle,
	ChevronLeft,
	ChevronRight,
	Edit,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCarById, fetchSettings } from '../services/apiService';
import { RestApiCar, SiteSettings, GalleryItem } from '../types/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Contact from '../components/Contact';
import Loader from '../components/Loader';
import { useAuth } from '../auth/useAuth';

// Вспомогательная функция для трансформации данных, перенесена сюда из apiService
const transformCarData = (
	car: RestApiCar
): {
	title: string;
	cost: string;
	description: string;
	images: GalleryItem[];
} => {
	const transformImage = (image: any): GalleryItem => {
		const baseItem = {
			id: image.id,
			title: image.description || 'Изображение',
			description: image.description || '',
		};
		if (image.type === 'BEFORE_AFTER') {
			return {
				...baseItem,
				type: 'beforeAfter',
				beforeImage: image.urlBefore,
				afterImage: image.urlAfter,
			};
		}
		return {
			...baseItem,
			type: 'single',
			imageUrl: image.urlSingle,
		};
	};

	return {
		title: car.name,
		cost: new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(car.price),
		description: car.description,
		images: car.images.map(transformImage),
	};
};

const CarPage: React.FC = () => {
	const navigate = useNavigate();
	const { carId } = useParams<{ carId: string }>();
	const { isLoggedIn } = useAuth();

	const {
		data: rawCar,
		isLoading: isLoadingCar,
		error: errorCar,
	} = useQuery<RestApiCar | null>({
		queryKey: ['carData', carId],
		queryFn: () => {
			if (!carId) return Promise.resolve(null);
			return fetchCarById(carId);
		},
		enabled: !!carId,
	});

	const { data: settings, isLoading: isLoadingSettings } =
		useQuery<SiteSettings | null>({
			queryKey: ['siteSettings'],
			queryFn: fetchSettings,
		});

	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

	useEffect(() => {
		setCurrentImageIndex(0);
	}, [carId]);

	if (isLoadingCar && !rawCar) {
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center pt-24 md:pt-32'>
				<Loader size='xl' text='Загрузка информации об автомобиле...' />
			</div>
		);
	}

	if (errorCar || (!isLoadingCar && !rawCar)) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 pt-24 md:pt-32 text-center px-4'>
				<h2 className='text-3xl font-bold text-white mb-4'>
					{errorCar ? 'Ошибка загрузки' : 'Автомобиль не найден'}
				</h2>
				<p className='text-gray-300 mb-6'>
					{errorCar
						? 'Не удалось загрузить данные. Пожалуйста, попробуйте позже.'
						: 'Запрошенный автомобиль не существует или был удален.'}
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

	if (!rawCar) {
		return null;
	}

	const car = transformCarData(rawCar);

	const mainImage =
		car.images[currentImageIndex]?.type === 'single'
			? (car.images[currentImageIndex] as any).imageUrl
			: '';
	const totalImages = car.images?.length || 0;

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
			if (totalImages <= 1) return;
			if (event.key === 'ArrowRight') goToNextImage();
			else if (event.key === 'ArrowLeft') goToPrevImage();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [totalImages, goToNextImage, goToPrevImage]);

	const handleThumbnailClick = (index: number) => {
		setCurrentImageIndex(index);
	};

	const phoneLink = settings?.phoneLink || '#';
	const whatsappLink = settings?.whatsappLink || '#';

	return (
		<div className='pt-16 md:pt-24 bg-gray-900 text-white'>
			<div className='container mx-auto px-4 py-12 md:py-16'>
				<div className='flex justify-between items-center mb-8'>
					<button
						onClick={() => navigate(-1)}
						className='flex items-center text-gray-300 hover:text-red-500 transition-colors'
					>
						<ArrowLeft size={20} className='mr-2' />
						Назад
					</button>
					{isLoggedIn && (
						<Link
							to={`/admin/cars/${carId}/edit`}
							className='flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors'
						>
							<Edit size={16} className='mr-2' />
							Редактировать
						</Link>
					)}
				</div>

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
									{totalImages > 0 ? (
										<Loader size='md' text='Загрузка изображения...' />
									) : (
										'Нет изображений'
									)}
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
								{car.images.map((image, index) =>
									image.type === 'single' ? (
										<button
											key={image.id}
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
												src={(image as any).imageUrl}
												alt={`${car.title} - миниатюра ${index + 1}`}
												className='w-full h-full object-cover'
											/>
										</button>
									) : null
								)}
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

						{isLoadingSettings && !settings ? (
							<div className='space-y-4 mb-8'>
								<div className='w-full flex items-center justify-center bg-red-600 text-white font-semibold py-3 px-6 rounded-md opacity-70 h-[48px]'>
									<Loader
										size='xs'
										spinnerClassName='border-white border-t-transparent'
									/>
								</div>
								<div className='w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-6 rounded-md opacity-70 h-[48px]'>
									<Loader
										size='xs'
										spinnerClassName='border-white border-t-transparent'
									/>
								</div>
							</div>
						) : (
							<div className='space-y-4 mb-8'>
								<a
									href={phoneLink}
									className='w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 h-[48px]'
								>
									<PhoneCall size={20} className='mr-2' />
									Позвонить
								</a>
								<a
									href={whatsappLink}
									target='_blank'
									rel='noopener noreferrer'
									className='w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 h-[48px]'
								>
									<MessageCircle size={20} className='mr-2' />
									Написать в WhatsApp
								</a>
							</div>
						)}

						<h2 className='text-2xl font-semibold text-white mb-3'>
							Описание
						</h2>
						{car.description ? (
							<MarkdownRenderer
								content={car.description}
								className='text-lg'
							/>
						) : (
							<p className='text-gray-300'>
								Подробное описание отсутствует.
							</p>
						)}
					</div>
				</div>
			</div>
			<Contact />
		</div>
	);
};

export default CarPage;
