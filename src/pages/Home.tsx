import React from 'react';
import Hero from '../components/Hero';
import GalleryPreview from '../components/GalleryPreview';
import Contact from '../components/Contact';
import ServicesSection from '../components/ServicesSection';
import CarsForSaleSection from '../components/CarsForSaleSection';
import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../services/apiService';
import { TransformedService } from '../types/api';
import Loader from '../components/Loader';

const Home = () => {
	const {
		data: servicesData,
		isLoading: isLoadingServices,
		error: errorServices,
	} = useQuery<TransformedService[]>({
		queryKey: ['services'],
		queryFn: fetchServices,
	});

	// Показываем лоадер, если идет загрузка услуг и данных еще нет
	if (isLoadingServices && !servicesData) {
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center'>
				<Loader size='xl' text='Загрузка данных...' />
			</div>
		);
	}

	if (errorServices && !servicesData) {
		console.error('Ошибка загрузки услуг:', errorServices);
		return (
			<div className='min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center text-center px-4'>
				<h2 className='text-2xl font-bold mb-4'>
					Ошибка загрузки данных.
				</h2>
				<p className='text-gray-300'>
					Пожалуйста, попробуйте обновить страницу или зайдите позже.
				</p>
			</div>
		);
	}

	const actualServices = servicesData || [];

	return (
		<div>
			<Hero />
			{actualServices.length > 0 && (
				<ServicesSection services={actualServices} />
			)}
			<GalleryPreview />
			<CarsForSaleSection />
			<Contact />
		</div>
	);
};

export default Home;
