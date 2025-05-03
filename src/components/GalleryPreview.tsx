import React from 'react';
import { Link } from 'react-router-dom';

// Импортируем наш кастомный компонент
import ImageCompare from './ImageCompare'; // Убедитесь, что путь правильный

// Импортируем наш единый массив данных
import { galleryItemsData } from '../data/imageData';

const GalleryPreview = () => {
	// Оставляем первые 6 элементов для предпросмотра (это даст 3 ряда по 2 элемента)
	const previewItems = galleryItemsData.slice(0, 6);

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

				{/* --- Измененная сетка --- */}
				{/* Было: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
				{/* Стало: grid-cols-1 md:grid-cols-2 */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-12'>
					{previewItems.map((item) => (
						<div key={item.id} className='group'>
							{/* Контейнер для изображения или слайдера */}
							{/* Увеличим высоту для больших карточек */}
							<div className='relative overflow-hidden rounded-lg h-[350px] md:h-[400px] mb-3 bg-gray-800'>
								{item.type === 'single' ? (
									<img
										src={item.imageUrl}
										alt={item.title}
										className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
										loading='lazy'
									/>
								) : (
									// --- Используем наш кастомный компонент ---
									<ImageCompare
										beforeImage={item.beforeImage}
										afterImage={item.afterImage}
										altBefore={`До - ${item.title}`}
										altAfter={`После - ${item.title}`}
									/>
								)}
							</div>

							{/* Общий блок для текста под изображением/слайдером */}
							<div>
								<h4 className='text-lg font-semibold text-white mb-1'>
									{item.title}
									{item.type === 'beforeAfter' && (
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

				<div className='text-center'>
					<Link
						to='/gallery'
						className='inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300'
					>
						Смотреть все работы
					</Link>
				</div>
			</div>
		</section>
	);
};

export default GalleryPreview;
