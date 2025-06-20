import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, X, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkExampleById } from '../services/apiService';
import {
	RestApiWorkExample,
	GalleryItem,
	RestApiImage,
} from '../types/api';
import ImageCompare from '../components/ImageCompare';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Loader from '../components/Loader';
import { useAuth } from '../auth/useAuth';

// Вспомогательная функция для трансформации данных
const transformWorkExampleData = (
	we: RestApiWorkExample
): {
	id: string;
	title: string;
	description: string;
	galleryItems: GalleryItem[];
} => {
	const transformImage = (image: RestApiImage): GalleryItem => {
		const baseItem = {
			id: image.id,
			title: image.description || 'Изображение',
			description: image.description || '',
		};
		if (image.type === 'BEFORE_AFTER') {
			return {
				...baseItem,
				type: 'beforeAfter',
				beforeImage: image.urlBefore!,
				afterImage: image.urlAfter!,
			};
		}
		return {
			...baseItem,
			type: 'single',
			imageUrl: image.urlSingle!,
		};
	};

	return {
		id: we.id,
		title: we.name,
		description: we.description,
		galleryItems: we.images.map(transformImage),
	};
};

const WorkExamplePage = () => {
	const navigate = useNavigate();
	const { workExampleId } = useParams<{ workExampleId: string }>();
	const { isLoggedIn } = useAuth();

	const {
		data: rawWorkExample,
		isLoading,
		error,
	} = useQuery<RestApiWorkExample | null>({
		queryKey: ['workExampleData', workExampleId],
		queryFn: () => {
			if (!workExampleId) return Promise.resolve(null);
			return fetchWorkExampleById(workExampleId);
		},
		enabled: !!workExampleId,
	});

	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(
		null
	);

	const workExampleData = rawWorkExample
		? transformWorkExampleData(rawWorkExample)
		: null;

	const openModal = (index: number) => {
		if (
			workExampleData &&
			index >= 0 &&
			index < workExampleData.galleryItems.length
		) {
			setActiveItemIndex(index);
			document.body.style.overflow = 'hidden';
		}
	};

	const closeModal = useCallback(() => {
		setActiveItemIndex(null);
		document.body.style.overflow = 'auto';
	}, []);

	const nextItem = useCallback(() => {
		if (activeItemIndex === null || !workExampleData?.galleryItems.length)
			return;
		setActiveItemIndex(
			(prev) => (prev! + 1) % workExampleData.galleryItems.length
		);
	}, [activeItemIndex, workExampleData]);

	const prevItem = useCallback(() => {
		if (activeItemIndex === null || !workExampleData?.galleryItems.length)
			return;
		setActiveItemIndex(
			(prev) =>
				(prev! - 1 + workExampleData.galleryItems.length) %
				workExampleData.galleryItems.length
		);
	}, [activeItemIndex, workExampleData]);

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

	if (isLoading && !workExampleData) {
		return (
			<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen text-white flex justify-center items-center'>
				<Loader size='xl' text='Загрузка проекта...' />
			</div>
		);
	}

	if (error || (!isLoading && !workExampleData)) {
		return (
			<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen flex flex-col justify-center items-center text-center px-4'>
				<h2 className='text-3xl font-bold text-white mb-4'>
					{error ? 'Ошибка загрузки проекта' : 'Проект не найден'}
				</h2>
				<p className='text-gray-300 mb-6'>
					{error
						? 'Не удалось загрузить данные о проекте.'
						: 'Запрошенный проект не существует или был удален.'}
				</p>
				<Link
					to='/gallery'
					className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md'
				>
					Ко всем работам
				</Link>
			</div>
		);
	}

	if (!workExampleData) {
		return null;
	}

	const activeModalItem: GalleryItem | null =
		activeItemIndex !== null
			? workExampleData.galleryItems[activeItemIndex]
			: null;

	const mainPreviewImage = workExampleData.galleryItems.find(
		(i) => i.type === 'single'
	) as GalleryItem | undefined;

	return (
		<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen'>
			<div className='container mx-auto px-4 py-16'>
				<div className='flex justify-between items-center mb-8'>
					<button
						onClick={() => navigate('/gallery')}
						className='flex items-center text-gray-300 hover:text-red-500 transition-colors'
					>
						<ArrowLeft size={20} className='mr-2' />
						Назад к галерее работ
					</button>
					{isLoggedIn && (
						<Link
							to={`/admin/work-examples/${workExampleId}/edit`}
							className='flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors'
						>
							<Edit size={16} className='mr-2' />
							Редактировать
						</Link>
					)}
				</div>

				{mainPreviewImage && mainPreviewImage.type === 'single' && (
					<div className='relative h-[40vh] md:h-[50vh] rounded-lg overflow-hidden mb-12 shadow-lg bg-gray-800'>
						<img
							src={(mainPreviewImage as any).imageUrl}
							alt={`Главное изображение для ${workExampleData.title}`}
							className='w-full h-full object-cover'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
					</div>
				)}

				<h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
					{workExampleData.title}
				</h1>

				<div className='mb-12'>
					<MarkdownRenderer content={workExampleData.description} />
				</div>

				{workExampleData.galleryItems.length === 0 && (
					<p className='text-center text-gray-400 text-lg py-10'>
						Для этого проекта пока нет изображений в галерее.
					</p>
				)}

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10'>
					{workExampleData.galleryItems.map((item, index) => (
						<div key={item.id} className='group'>
							<div
								className='relative overflow-hidden rounded-lg h-[300px] md:h-[350px] mb-3 bg-gray-800 cursor-pointer shadow-md hover:shadow-red-500/30 transition-shadow'
								onClick={() => openModal(index)}
							>
								{item.type === 'single' ? (
									<>
										<img
											src={(item as any).imageUrl}
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
										beforeImage={(item as any).beforeImage}
										afterImage={(item as any).afterImage}
										altBefore={`До - ${item.title}`}
										altAfter={`После - ${item.title}`}
									/>
								)}
							</div>
							<div>
								<h4
									className='text-lg font-semibold text-white mb-1 truncate'
									title={item.title}
								>
									{item.title}
								</h4>
								{item.type === 'beforeAfter' && (
									<span className='text-sm text-gray-400 ml-0 block mb-1'>
										(Сравнение До/После)
									</span>
								)}
								<p
									className='text-gray-300 text-sm line-clamp-2'
									title={item.description}
								>
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{activeModalItem && (
				<div
					className='fixed inset-0 bg-black/90 z-[100] flex flex-col p-4 md:p-8 items-center justify-center'
					onClick={closeModal}
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							closeModal();
						}}
						className='absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-red-500 transition-colors z-[102]'
						aria-label='Закрыть'
					>
						<X size={32} />
					</button>

					<div
						className='relative w-full h-full flex flex-col items-center justify-center'
						onClick={(e) => e.stopPropagation()}
					>
						<div className='flex-grow flex items-center justify-center w-full max-w-5xl max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-150px)] mb-4'>
							{activeModalItem.type === 'single' ? (
								<img
									src={(activeModalItem as any).imageUrl}
									alt={activeModalItem.title}
									className='block max-w-full max-h-full object-contain rounded-lg shadow-xl'
								/>
							) : (
								<div className='w-full h-full bg-gray-800 rounded-lg overflow-hidden'>
									<ImageCompare
										beforeImage={(activeModalItem as any).beforeImage}
										afterImage={(activeModalItem as any).afterImage}
										altBefore={`До - ${activeModalItem.title}`}
										altAfter={`После - ${activeModalItem.title}`}
									/>
								</div>
							)}
						</div>

						<div className='w-full max-w-4xl text-center text-white flex justify-between items-center shrink-0'>
							<button
								onClick={(e) => {
									e.stopPropagation();
									prevItem();
								}}
								className='bg-black/50 rounded-full p-2 hover:bg-red-600 transition-colors'
								aria-label='Предыдущий слайд'
								disabled={workExampleData.galleryItems.length <= 1}
							>
								<ArrowLeft size={24} />
							</button>
							<div className='px-4 flex-grow min-w-0'>
								<h3
									className='text-lg md:text-xl font-semibold truncate'
									title={activeModalItem.title}
								>
									{activeModalItem.title}
								</h3>
								<p
									className='text-sm text-gray-300 truncate'
									title={activeModalItem.description}
								>
									{activeModalItem.description}
								</p>
							</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									nextItem();
								}}
								className='bg-black/50 rounded-full p-2 hover:bg-red-600 transition-colors'
								aria-label='Следующий слайд'
								disabled={workExampleData.galleryItems.length <= 1}
							>
								<ArrowLeft size={24} className='rotate-180' />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default WorkExamplePage;
