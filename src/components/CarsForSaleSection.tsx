import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCars } from '../services/apiService';
import { TransformedCarPreview } from '../types/api';
import CarCard from './CarCard';
import Loader from './Loader';
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const CarsForSaleSection = () => {
	const { isLoggedIn } = useAuth();
	const {
		data: cars,
		isLoading,
		error,
	} = useQuery<TransformedCarPreview[]>({
		queryKey: ['carsForSale'],
		queryFn: fetchCars,
	});

	if (isLoading && !cars) {
		return (
			<section className='py-20 bg-gray-900'>
				<div className='container mx-auto px-4 flex justify-center items-center h-64'>
					<Loader size='lg' text='Загрузка автомобилей...' />
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className='py-20 bg-gray-900'>
				<div className='container mx-auto px-4 text-center text-red-500'>
					Ошибка загрузки автомобилей на продажу.
				</div>
			</section>
		);
	}

	if (!cars || cars.length === 0) {
		return (
			<section id='cars-for-sale' className='py-20 bg-gray-900'>
				<div className='container mx-auto px-4'>
					<div className='text-center mb-12 relative'>
						<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
							Автомобили на продажу
						</h2>
						{isLoggedIn && (
							<Link
								to='/admin/cars/new'
								className='absolute top-0 right-0 -mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2'
							>
								<PlusCircle size={20} />
								Создать
							</Link>
						)}
						<p className='text-gray-400 max-w-2xl mx-auto'>
							В данный момент нет автомобилей в продаже. Загляните позже!
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id='cars-for-sale' className='py-20 bg-gray-900'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12 relative'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Автомобили на продажу
					</h2>
					{isLoggedIn && (
						<Link
							to='/admin/cars/new'
							className='absolute top-0 right-0 -mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2'
						>
							<PlusCircle size={20} />
							Создать
						</Link>
					)}
					<p className='text-gray-400 max-w-2xl mx-auto'>
						Ознакомьтесь с автомобилями, доступными для покупки в нашем
						автосервисе.
					</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
					{cars.map((car) => (
						<CarCard key={car.id} car={car} />
					))}
				</div>
			</div>
		</section>
	);
};

export default CarsForSaleSection;
