import React from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { ManagedImagePayload } from '../../types/api';

interface ImagePreviewGridProps {
	images: ManagedImagePayload[];
	onManageClick: () => void;
	onRemoveClick: (key: string) => void;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
	images,
	onManageClick,
	onRemoveClick,
}) => {
	const getPreviewUrls = (
		img: ManagedImagePayload
	): { single?: string; before?: string; after?: string } => {
		if ('id' in img) {
			// ExistingImagePayload
			return {
				single: img.previewUrl,
				before: img.previewUrlBefore,
				after: img.previewUrlAfter,
			};
		}
		// ImageFilePayload
		if (img.type === 'SINGLE') {
			return { single: img.previewUrl };
		}
		return { before: img.previewUrlBefore, after: img.previewUrlAfter };
	};

	return (
		<div>
			<div className='flex justify-between items-center mb-2'>
				<label className='block text-sm font-medium text-gray-300'>
					Изображения ({images.length} шт.)
				</label>
				<button
					type='button'
					onClick={onManageClick}
					className='flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md'
				>
					<ImagePlus size={16} className='mr-2' />
					Добавить / Управлять
				</button>
			</div>

			{images.length === 0 ? (
				<div className='text-center py-6 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg'>
					<p className='text-gray-400'>Нет изображений.</p>
					<p className='text-xs text-gray-500'>
						Нажмите "Добавить", чтобы загрузить.
					</p>
				</div>
			) : (
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700'>
					{images.map((img) => {
						const previews = getPreviewUrls(img);
						const isNew = !('id' in img);
						const tagText = isNew ? 'Новое' : 'Сохраненное';
						const tagClass = isNew ? 'bg-green-600/80' : 'bg-blue-600/80';

						return (
							<div
								key={img.key}
								className='relative aspect-square group bg-gray-800 rounded-md overflow-hidden'
							>
								{img.type === 'SINGLE' ? (
									<img
										src={previews.single}
										alt={img.description}
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='w-full h-full flex'>
										<img
											src={previews.before}
											alt={`До: ${img.description}`}
											className='w-1/2 h-full object-cover'
										/>
										<img
											src={previews.after}
											alt={`После: ${img.description}`}
											className='w-1/2 h-full object-cover'
										/>
									</div>
								)}

								{/* Overlay с центрированным текстом */}
								<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-2'>
									<div className='flex-grow flex items-center justify-center text-center'>
										<p
											className='text-xs text-white text-balance'
											title={img.description}
										>
											{img.description || 'Без описания'}
										</p>
									</div>
								</div>

								{/* Кнопка удаления, всегда видима при наведении */}
								<button
									type='button'
									onClick={() => onRemoveClick(img.key)}
									className='absolute top-1.5 right-1.5 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10'
									title='Удалить'
								>
									<Trash2 size={14} />
								</button>

								{/* Tag - теперь не виден при наведении */}
								<div
									className={`absolute top-1.5 left-1.5 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tagClass} group-hover:opacity-0 transition-opacity`}
								>
									{tagText}
								</div>

								{img.type === 'BEFORE_AFTER' && (
									<div className='absolute bottom-1.5 left-1.5 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-700/80 group-hover:opacity-0 transition-opacity'>
										До/После
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ImagePreviewGrid;
