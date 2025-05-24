import React from 'react';
import Hero from '../components/Hero';
import GalleryPreview from '../components/GalleryPreview';
import Contact from '../components/Contact';
import ServicesSection from '../components/ServicesSection';
import CarsForSaleSection from '../components/CarsForSaleSection'; // Новый импорт
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

	if (isLoadingServices || isLoadingWhyChooseUs) {
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center'>
				Загрузка данных...
			</div>
		);
	}

	if (errorServices || errorWhyChooseUs) {
		console.error('Ошибка загрузки услуг:', errorServices);
		console.error(
			'Ошибка загрузки данных "Почему выбирают нас":',
			errorWhyChooseUs
		);
		return (
			<div className='min-h-screen bg-gray-900 text-white flex justify-center items-center'>
				Ошибка загрузки данных. Пожалуйста, попробуйте позже.
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
			{actualServices.length > 0 && (
				<ServicesSection services={actualServices} />
			)}
			<GalleryPreview />
			<CarsForSaleSection /> {/* Новая секция добавлена здесь */}
			<Contact />
		</div>
	);
};

export default Home;
