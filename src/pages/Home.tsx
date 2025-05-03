import React from 'react';
import Hero from '../components/Hero';
import GalleryPreview from '../components/GalleryPreview';
import Contact from '../components/Contact';
import ServicesSection from '../components/ServicesSection';
import { servicesData } from '../data/servicesData';

const Home = () => {
	const whyChooseUs = servicesData.find(
		(service) => service.id === 'why-choose-us'
	);
	const otherServices = servicesData.filter(
		(service) => service.id !== 'why-choose-us'
	);

	return (
		<div>
			<Hero />

			{whyChooseUs && (
				<section className='py-20 bg-gray-950'>
					<div className='container mx-auto px-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
							<div>
								<h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
									{whyChooseUs.title}
								</h2>
								<p className='text-gray-300 text-lg mb-8'>
									{whyChooseUs.fullDescription}
								</p>
								<ul className='space-y-4'>
									{whyChooseUs.services.map((service, index) => (
										<li
											key={index}
											className='flex items-start text-gray-300'
										>
											<span className='text-red-500 mr-3'>•</span>
											{service}
										</li>
									))}
								</ul>
							</div>
							<div className='relative h-[400px] rounded-lg overflow-hidden'>
								<img
									src={whyChooseUs.imageUrl}
									alt={whyChooseUs.title}
									className='w-full h-full object-cover'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
							</div>
						</div>
					</div>
				</section>
			)}

			<ServicesSection services={otherServices} />

			<GalleryPreview />
			<Contact />
		</div>
	);
};

export default Home;
