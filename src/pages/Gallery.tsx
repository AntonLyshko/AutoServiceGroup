import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { galleryItemsData, GalleryItem } from '../data/imageData';
import ImageCompare from '../components/ImageCompare';

const Gallery = () => {
	const navigate = useNavigate();
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(
		null
	);

	const openModal = (index: number) => {
		if (index >= 0 && index < galleryItemsData.length) {
			setActiveItemIndex(index);
			document.body.style.overflow = 'hidden';
		}
	};

	const closeModal = useCallback(() => {
		setActiveItemIndex(null);
		document.body.style.overflow = 'auto';
	}, []);

	const nextItem = useCallback(() => {
		if (activeItemIndex === null) return;
		setActiveItemIndex((prevIndex) =>
			prevIndex !== null ? (prevIndex + 1) % galleryItemsData.length : null
		);
	}, [activeItemIndex]);

	const prevItem = useCallback(() => {
		if (activeItemIndex === null) return;
		setActiveItemIndex((prevIndex) =>
			prevIndex !== null
				? (prevIndex - 1 + galleryItemsData.length) %
				  galleryItemsData.length
				: null
		);
	}, [activeItemIndex]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (activeItemIndex === null) return;
			if (event.key === 'Escape') closeModal();
			else if (event.key === 'ArrowRight') nextItem();
			else if (event.key === 'ArrowLeft') prevItem();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [activeItemIndex, closeModal, nextItem, prevItem]);

	const activeItem =
		activeItemIndex !== null ? galleryItemsData[activeItemIndex] : null;

	return (
		<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen'>
			<div className='container mx-auto px-4 py-16'>
				<button
					onClick={() => navigate('/')}
					className='mb-8 flex items-center text-gray-300 hover:text-red-500 transition-colors'
				>
					<ArrowLeft size={20} className='mr-2' />
					Назад на главную
				</button>

				<h1 className='text-4xl font-bold text-white mb-6'>
					Галерея наших работ
				</h1>
				<p className='text-gray-300 mb-12 max-w-3xl'>
					Здесь вы можете увидеть примеры наших работ. Кликните на любую
					карточку, чтобы открыть ее в режиме просмотра и листать галерею.
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10'>
					{galleryItemsData.map((item, index) => (
						<div key={item.id} className='group'>
							<div
								className='relative overflow-hidden rounded-lg h-[350px] md:h-[400px] mb-3 bg-gray-800 cursor-pointer'
								onClick={() => openModal(index)}
							>
								{item.type === 'single' ? (
									<>
										<img
											src={item.imageUrl}
											alt={item.title}
											className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
											loading='lazy'
										/>
										<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth={1.5}
												stroke='white'
												className='w-12 h-12'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
												/>
											</svg>
										</div>
									</>
								) : (
									<ImageCompare
										beforeImage={item.beforeImage}
										afterImage={item.afterImage}
										altBefore={`До - ${item.title}`}
										altAfter={`После - ${item.title}`}
									/>
								)}
							</div>
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
			</div>

			{activeItem !== null && (
				<div
					className='fixed inset-0 bg-black/90 z-[100] flex flex-col p-4'
					onClick={closeModal}
				>
					<button
						onClick={closeModal}
						className='absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-[102]'
						aria-label='Закрыть'
					>
						<X size={32} />
					</button>

					<div
						className='relative flex-grow flex items-center justify-center w-full h-full overflow-hidden'
						onClick={(e) => e.stopPropagation()}
					>
						{activeItem.type === 'single' ? (
							<img
								src={activeItem.imageUrl}
								alt={activeItem.title}
								className='block max-w-full max-h-full object-contain rounded-lg shadow-xl'
							/>
						) : (
							<div className='w-full h-full max-w-6xl max-h-[85vh] aspect-video bg-gray-800 rounded overflow-hidden'>
								<ImageCompare
									beforeImage={activeItem.beforeImage}
									afterImage={activeItem.afterImage}
									altBefore={`До - ${activeItem.title}`}
									altAfter={`После - ${activeItem.title}`}
								/>
							</div>
						)}
					</div>

					<div
						className='w-full max-w-4xl mx-auto text-center pt-4 text-white flex justify-between items-center'
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={prevItem}
							className='bg-black/50 rounded-full p-2 hover:bg-red-600 transition-colors'
							aria-label='Предыдущий слайд'
						>
							<ArrowLeft size={24} />
						</button>
						<div className='px-4'>
							<h3 className='text-lg md:text-xl font-semibold'>
								{activeItem.title}
							</h3>
							<p className='text-sm text-gray-300'>
								{activeItem.description}
							</p>
						</div>
						<button
							onClick={nextItem}
							className='bg-black/50 rounded-full p-2 hover:bg-red-600 transition-colors rotate-180'
							aria-label='Следующий слайд'
						>
							<ArrowLeft size={24} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Gallery;
