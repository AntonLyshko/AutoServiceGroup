import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkExamples } from '../services/apiService';
import { TransformedWorkExamplePreview } from '../types/api';
import ImageCompare from './ImageCompare';
import Loader from './Loader';

const GalleryPreview = () => {
	const {
		data: workExamples,
		isLoading,
		error,
	} = useQuery<TransformedWorkExamplePreview[]>({
		queryKey: ['workExamples'],
		queryFn: fetchWorkExamples,
	});

	if (isLoading && !workExamples) {
		return (
			<section className='py-20 bg-gray-950'>
				<div className='container mx-auto px-4 flex justify-center items-center h-96'>
					<Loader size='lg' text='Загрузка примеров работ...' />
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className='py-20 bg-gray-950'>
				<div className='container mx-auto px-4 text-center text-red-500'>
					Ошибка загрузки примеров работ.
				</div>
			</section>
		);
	}

	const previewItems = workExamples?.slice(0, 6) || [];

	return (
		<section className='py-20 bg-gray-950'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
						Наши работы
					</h2>
					<p className='text-gray-400 max-w-2xl mx-auto'>
						Примеры выполненных работ по ремонту, обслуживанию и детейлингу
						автомобилей.
					</p>
				</div>

				{previewItems.length === 0 && !isLoading && (
					<p className='text-center text-gray-400'>
						Примеров работ пока нет.
					</p>
				)}

				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-12'>
					{previewItems.map((item) => (
						<div key={item.id} className='group'>
							<Link to={`/work-examples/${item.id}`}>
								<div className='relative overflow-hidden rounded-lg h-[350px] md:h-[400px] mb-3 bg-gray-800'>
									{item.previewImage.type === 'single' ? (
										<img
											src={item.previewImage.imageUrl}
											alt={item.title}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											loading='lazy'
										/>
									) : (
										<ImageCompare
											beforeImage={item.previewImage.beforeImage}
											afterImage={item.previewImage.afterImage}
											altBefore={`До - ${item.title}`}
											altAfter={`После - ${item.title}`}
										/>
									)}
								</div>
							</Link>
							<div>
								<h4 className='text-lg font-semibold text-white mb-1'>
									<Link
										to={`/work-examples/${item.id}`}
										className='hover:text-red-500'
									>
										{item.title}
									</Link>
									{item.previewImage.type === 'beforeAfter' && (
										<span className='text-sm text-gray-400 ml-2'>
											(До/После)
										</span>
									)}
								</h4>
								<p className='text-gray-300 text-sm'>{item.description}</p>
							</div>
						</div>
					))}
				</div>

				{previewItems.length > 0 && (
					<div className='text-center'>
						<Link
							to='/gallery'
							className='inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300'
						>
							Смотреть все работы
						</Link>
					</div>
				)}
			</div>
		</section>
	);
};

export default GalleryPreview;
