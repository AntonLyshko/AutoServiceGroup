import React from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHeroData, fetchGeneralData } from '../services/apiService';
import { TransformedHeroData, TransformedGeneralData } from '../types/api';
// import heroBackgroundImage from '../img/img_1.webp'; // Удаляем статический импорт

const Hero = () => {
	const {
		data: heroData,
		isLoading: isLoadingHero,
		error: errorHero,
	} = useQuery<TransformedHeroData | null>({
		queryKey: ['heroData'],
		queryFn: fetchHeroData,
	});

	const { data: generalData, isLoading: isLoadingGeneral } =
		useQuery<TransformedGeneralData | null>({
			queryKey: ['generalData'],
			queryFn: fetchGeneralData,
		});

	const scrollToContent = () => {
		window.scrollTo({
			top: window.innerHeight,
			behavior: 'smooth',
		});
	};

	// Значения по умолчанию, если данные еще грузятся или есть ошибка
	let title = 'Автосервис';
	let secondTitle = 'ТрейдАвто-групп';
	let description =
		'Профессиональный ремонт и обслуживание автомобилей любых марок с использованием современного оборудования и оригинальных запчастей';
	let heroBackgroundImageUrl = '/img/img_1.webp'; // Запасное локальное изображение по умолчанию

	if (isLoadingHero) {
		title = 'Загрузка...';
		secondTitle = '';
		description = 'Пожалуйста, подождите.';
		// Пока данные грузятся, можно оставить запасное изображение или не устанавливать фон вообще
	} else if (errorHero) {
		console.error('Ошибка загрузки данных для Hero:', errorHero);
		// Используем значения по умолчанию и запасное изображение
	} else if (heroData) {
		title = heroData.title;
		secondTitle = heroData.secondTitle;
		description = heroData.description;
		heroBackgroundImageUrl = heroData.backgroundImageUrl; // Используем URL с бэкенда
	}

	const whatsAppNumber = generalData?.whatsappPhone || '79655118585';
	const whatsAppLink = `https://wa.me/${whatsAppNumber}`;

	return (
		<div
			className='relative h-screen w-full bg-cover bg-center flex items-center transition-all duration-500' // Добавил transition для плавности смены фона
			style={{
				backgroundImage: `url(${heroBackgroundImageUrl})`, // Используем динамический URL
				backgroundPosition: 'center',
				backgroundSize: 'cover',
			}}
		>
			<div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-0'></div>

			<div className='container mx-auto px-4 z-10 text-center'>
				<h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
					{title}
					<br />
					<span className='text-red-600 relative top-2'>
						{secondTitle}
					</span>
				</h1>
				<p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto'>
					{description}
				</p>
				<div className='flex flex-col sm:flex-row justify-center gap-4'>
					{isLoadingGeneral ? (
						<div className='py-3 px-8 bg-green-600 text-white font-semibold rounded-md flex items-center justify-center opacity-50'>
							<MessageCircle className='mr-2' size={20} />
							Загрузка...
						</div>
					) : (
						<a
							href={whatsAppLink}
							target='_blank'
							rel='noopener noreferrer'
							className='py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-300 flex items-center justify-center'
						>
							<MessageCircle className='mr-2' size={20} />
							Написать в WhatsApp
						</a>
					)}
					<button
						onClick={scrollToContent}
						className='py-3 px-8 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold rounded-md transition-all duration-300'
					>
						Узнать больше
					</button>
				</div>
			</div>

			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
				<button
					onClick={scrollToContent}
					className='text-white focus:outline-none'
					aria-label='Scroll down'
				>
					<ChevronDown size={32} />
				</button>
			</div>
		</div>
	);
};

export default Hero;
