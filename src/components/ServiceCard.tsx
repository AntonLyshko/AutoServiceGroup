import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
	id,
	title,
	description,
	imageUrl,
	index,
}) => {
	// const isEven = index % 2 === 0; // Переменная isEven больше не используется в стилях

	return (
		<div
			className={`relative overflow-hidden bg-gray-800 rounded-lg group transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] h-[300px] md:h-[400px]`}
		>
			{/* Background image with overlay */}
			<div
				className='absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110'
				style={{ backgroundImage: `url(${imageUrl})` }}
			/>
			<div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300'></div>

			{/* Content */}
			<div className='relative h-full flex flex-col justify-end p-6 z-10'>
				<h3 className='text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors duration-300'>
					{title}
				</h3>
				{/* Добавлен класс text-base для увеличения шрифта описания */}
				<p className='text-gray-300 mb-6 max-w-md text-lg'>
					{description}
				</p>
				<Link
					to={`/services/${id}`}
					className='inline-flex items-center text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition-colors duration-300 w-fit'
				>
					Подробнее
					<ArrowRight size={18} className='ml-2' />
				</Link>
			</div>
		</div>
	);
};

export default ServiceCard;
