import React from 'react';
import Hero from '../components/Hero';
import GalleryPreview from '../components/GalleryPreview';
import Contact from '../components/Contact';
import ServicesSection from '../components/ServicesSection';
import CarsForSaleSection from '../components/CarsForSaleSection';
import { useQuery } from '@tanstack/react-query';
import {
	fetchServices,
	fetchWhyChooseUsData,
} from '../services/apiService';
import {
	TransformedService,
	TransformedWhyChooseUsData,
} from '../types/api';
import StrapiRichTextRenderer from '../components/StrapiRichTextRenderer';
import Loader from '../components/Loader'; // Импорт Loader

const Home = () => {
	const {
		data: servicesData,
		isLoading: isLoadingServices,
		error: errorServices,
	} = useQuery<TransformedService[]>({
		queryKey: ['services'],
		queryFn: fetchServices,
	});

	const {
		data: whyChooseUsData,
		isLoading: isLoadingWhyChooseUs,
		error: errorWhyChooseUs,
	} = useQuery<TransformedWhyChooseUsData | null>({
		queryKey: ['whyChooseUsData'],
		queryFn: fetchWhyChooseUsData,
	});

	// Показываем лоадер, если хотя бы один из основных запросов в процессе и для него еще нет данных
	if (
		(isLoadingServices && !servicesData) ||
		(isLoadingWhyChooseUs && !whyChooseUsData)
	) {
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center'>
				<Loader size='xl' text='Загрузка данных...' />
			</div>
		);
	}

	// Показываем ошибку, если любой из основных запросов завершился с ошибкой и для него нет данных
	if (
		(errorServices && !servicesData) ||
		(errorWhyChooseUs && !whyChooseUsData)
	) {
		console.error('Ошибка загрузки услуг:', errorServices);
		console.error(
			'Ошибка загрузки данных "Почему выбирают нас":',
			errorWhyChooseUs
		);
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
			{whyChooseUsData && (
				<section className='py-20 bg-gray-950'>
					<div className='container mx-auto px-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
							<div>
								<h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
									{whyChooseUsData.title}
								</h2>
								<div className='prose prose-invert max-w-none text-gray-300 text-lg mb-8'>
									{whyChooseUsData.fullDescriptionObject && (
										<StrapiRichTextRenderer
											content={whyChooseUsData.fullDescriptionObject}
										/>
									)}
								</div>
							</div>
							<div className='relative h-[400px] rounded-lg overflow-hidden shadow-lg'>
								<img
									src={whyChooseUsData.imageUrl}
									alt={whyChooseUsData.title}
									className='w-full h-full object-cover'
									loading='lazy'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
							</div>
						</div>
					</div>
				</section>
			)}
			{/* Если servicesData еще грузятся (но whyChooseUsData уже есть), ServicesSection покажет свой внутренний лоадер, если он там есть, или просто не отрендерится */}
			{actualServices.length > 0 && (
				<ServicesSection services={actualServices} />
			)}
			{/* Если ServicesSection не имеет своего лоадера для isLoading && !data, можно добавить здесь: */}
			{isLoadingServices && !actualServices.length && (
				<section className='py-20 bg-gray-900'>
					<div className='container mx-auto px-4 flex justify-center items-center h-64'>
						<Loader size='lg' text='Загрузка услуг...' />
					</div>
				</section>
			)}
			<GalleryPreview />
			<CarsForSaleSection />
			<Contact />
		</div>
	);
};

export default Home;
