// src/components/Hero.tsx
import React from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
// Импортируем новое фоновое изображение
import heroBackgroundImage from '../img/img_1.webp';

const Hero = () => {
	const scrollToContent = () => {
		window.scrollTo({
			top: window.innerHeight,
			behavior: 'smooth',
		});
	};

	return (
		<div
			className='relative h-screen w-full bg-cover bg-center flex items-center'
			style={{
				// Используем импортированное изображение
				backgroundImage: `url(${heroBackgroundImage})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
			}}
		>
			{/* Overlay */}
			<div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-0'></div>

			<div className='container mx-auto px-4 z-10 text-center'>
				<h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
					Автосервиса
					<br />
					<span className='text-red-600 relative top-2'>
						ТрейдАвто-групп
					</span>
				</h1>
				<p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto'>
					Профессиональный ремонт и обслуживание автомобилей любых марок с
					использованием современного оборудования и оригинальных запчастей
				</p>
				<div className='flex flex-col sm:flex-row justify-center gap-4'>
					<a
						href='https://wa.me/79655118585'
						target='_blank'
						rel='noopener noreferrer'
						className='py-3 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-300 flex items-center justify-center'
					>
						<MessageCircle className='mr-2' size={20} />
						Написать в WhatsApp
					</a>
					<button
						onClick={scrollToContent}
						className='py-3 px-8 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold rounded-md transition-all duration-300'
					>
						Узнать больше
					</button>
				</div>
			</div>

			{/* Scroll down indicator */}
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
