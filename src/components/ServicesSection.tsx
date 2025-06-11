import React from 'react';
import ServiceCard from './ServiceCard';
import { TransformedService } from '../types/api';
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface ServicesSectionProps {
	services: TransformedService[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
	const { isLoggedIn } = useAuth();
	// Сокращаем описание для карточек
	const getShortDescription = (description: string) => {
		if (description.length > 120) {
			return description.substring(0, 120) + '...';
		}
		return description;
	};

	return (
		<section id='services' className='py-20 bg-gray-900'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12 relative'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Наши услуги
					</h2>
					{isLoggedIn && (
						<Link
							to='/admin/services/new'
							className='absolute top-0 right-0 -mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2'
						>
							<PlusCircle size={20} />
							Создать
						</Link>
					)}
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
							description={getShortDescription(service.description)}
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
