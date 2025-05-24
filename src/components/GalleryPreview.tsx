import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkExamplesForPreview } from '../services/apiService';
import { TransformedWorkExamplePreviewItem } from '../types/api';
import ImageCompare from './ImageCompare';

const GalleryPreview = () => {
	const {
		data: workExamplesPreviewData,
		isLoading,
		error,
	} = useQuery<TransformedWorkExamplePreviewItem[]>({
		queryKey: ['workExamplesPreview'], // Ключ для кеширования
		queryFn: fetchWorkExamplesForPreview,
	});

	if (isLoading) {
		return (
			<section className='py-20 bg-gray-950'>
				<div className='container mx-auto px-4 text-center text-white'>
					Загрузка примеров работ...
				</div>
			</section>
		);
	}

	if (error || !workExamplesPreviewData) {
		return (
			<section className='py-20 bg-gray-950'>
				<div className='container mx-auto px-4 text-center text-red-500'>
					Ошибка загрузки примеров работ.
				</div>
			</section>
		);
	}

	const previewItems = workExamplesPreviewData.slice(0, 6);

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
						// item здесь TransformedWorkExamplePreviewItem
						// item.id это ID первого gallery_item или ID WorkExample (если gallery_item нет)
						// item.workExampleId это всегда ID WorkExample
						<div
							key={item.workExampleId + (item.id || '')}
							className='group'
						>
							{/* Ссылка ведет на страницу конкретного примера работы */}
							<Link to={`/work-examples/${item.workExampleId}`}>
								<div className='relative overflow-hidden rounded-lg h-[350px] md:h-[400px] mb-3 bg-gray-800'>
									{item.type === 'single' ? (
										<img
											src={item.imageUrl} // URL из TransformedWorkExamplePreviewItem
											alt={item.title} // title из TransformedWorkExamplePreviewItem
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											loading='lazy'
										/>
									) : (
										<ImageCompare
											beforeImage={item.beforeImage} // Убедитесь, что beforeImage и afterImage существуют для type 'beforeAfter'
											afterImage={item.afterImage}
											altBefore={`До - ${item.title}`}
											altAfter={`После - ${item.title}`}
										/>
									)}
								</div>
							</Link>
							<div>
								<h4 className='text-lg font-semibold text-white mb-1'>
									<Link
										to={`/work-examples/${item.workExampleId}`}
										className='hover:text-red-500'
									>
										{/* Отображаем originalTitle (заголовок WorkExample) */}
										{item.originalTitle}
									</Link>
									{item.type === 'beforeAfter' && (
										<span className='text-sm text-gray-400 ml-2'>
											(До/После){' '}
											{/* Это относится к типу отображения карточки, а не всего WorkExample */}
										</span>
									)}
								</h4>
								{/* Отображаем description от WorkExample (через originalTitle) или от gallery_item */}
								<p className='text-gray-300 text-sm'>{item.description}</p>
							</div>
						</div>
					))}
				</div>

				{previewItems.length > 0 && (
					<div className='text-center'>
						<Link
							to='/gallery' // Ссылка на страницу со списком всех примеров работ
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
