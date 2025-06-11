import React from 'react';
import { Link } from 'react-router-dom';
import { TransformedCarPreview } from '../types/api';
import { CarFront } from 'lucide-react';

interface CarCardProps {
	car: TransformedCarPreview;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
	return (
		<Link
			to={`/cars/${car.id}`}
			className='group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-red-500/40 transition-all duration-300'
		>
			<div className='relative w-full h-56 md:h-64 bg-gray-700'>
				{car.imageUrl && car.imageUrl !== '/placeholder.png' ? (
					<img
						src={car.imageUrl}
						alt={car.title}
						className='w-full h-full object-cover'
						loading='lazy'
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center text-gray-500'>
						<CarFront size={64} />
					</div>
				)}
				<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300'></div>
			</div>
			<div className='p-5'>
				<h3 className='text-xl font-semibold text-white mb-2 truncate group-hover:text-red-500 transition-colors duration-300'>
					{car.title}
				</h3>
				<p className='text-2xl font-bold text-red-500 mb-3'>{car.cost}</p>
				<span className='inline-block w-full text-center bg-red-600 group-hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300'>
					Подробнее
				</span>
			</div>
		</Link>
	);
};

export default CarCard;
