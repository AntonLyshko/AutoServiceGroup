import React from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '../data/servicesData';

interface ServicesSectionProps {
	services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
	return (
		<section id='services' className='py-20 bg-gray-900'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Наши услуги
					</h2>
					<p className='text-gray-400 max-w-2xl mx-auto'>
						Мы предлагаем полный спектр услуг по ремонту и обслуживанию
						автомобилей любых марок
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{services.map((service, index) => (
						<ServiceCard
							key={service.id}
							id={service.id}
							title={service.title}
							description={service.shortDescription}
							imageUrl={service.imageUrl}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default ServicesSection;
