import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Image, Images } from 'lucide-react';
import {
	ImageFilePayload,
	ManagedImagePayload,
	ExistingImagePayload,
} from '../../types/api';

interface ImageManagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (images: ManagedImagePayload[]) => void;
	initialImages: ManagedImagePayload[];
}

const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
	isOpen,
	onClose,
	onSave,
	initialImages,
}) => {
	const [images, setImages] =
		useState<ManagedImagePayload[]>(initialImages);
	const [newImageType, setNewImageType] = useState<
		'single' | 'beforeAfter'
	>('single');
	const [newImageDesc, setNewImageDesc] = useState('');

	// Refs для файловых инпутов
	const singleFileRef = useRef<HTMLInputElement>(null);
	const beforeFileRef = useRef<HTMLInputElement>(null);
	const afterFileRef = useRef<HTMLInputElement>(null);

	// Обновляем состояние, если initialImages изменились
	useEffect(() => {
		setImages(initialImages);
	}, [initialImages]);

	// Очищаем превью URL при размонтировании
	useEffect(() => {
		return () => {
			images.forEach((img) => {
				// Очищаем только для новых файлов, т.к. для существующих это полный URL
				if (!('id' in img)) {
					if (img.type === 'SINGLE') {
						URL.revokeObjectURL(img.previewUrl);
					} else {
						URL.revokeObjectURL(img.previewUrlBefore);
						URL.revokeObjectURL(img.previewUrlAfter);
					}
				}
			});
		};
	}, [images]);

	if (!isOpen) return null;

	const resetForm = () => {
		setNewImageDesc('');
		if (singleFileRef.current) singleFileRef.current.value = '';
		if (beforeFileRef.current) beforeFileRef.current.value = '';
		if (afterFileRef.current) afterFileRef.current.value = '';
	};

	const handleAddImage = () => {
		let newImage: ImageFilePayload | null = null;
		const key = `${Date.now()}-${Math.random()}`;

		if (newImageType === 'single' && singleFileRef.current?.files?.[0]) {
			const file = singleFileRef.current.files[0];
			newImage = {
				key,
				type: 'SINGLE',
				file,
				description: newImageDesc || file.name,
				previewUrl: URL.createObjectURL(file),
			};
		} else if (
			newImageType === 'beforeAfter' &&
			beforeFileRef.current?.files?.[0] &&
			afterFileRef.current?.files?.[0]
		) {
			const fileBefore = beforeFileRef.current.files[0];
			const fileAfter = afterFileRef.current.files[0];
			newImage = {
				key,
				type: 'BEFORE_AFTER',
				fileBefore,
				fileAfter,
				description: newImageDesc || 'Сравнение До/После',
				previewUrlBefore: URL.createObjectURL(fileBefore),
				previewUrlAfter: URL.createObjectURL(fileAfter),
			};
		}

		if (newImage) {
			setImages([...images, newImage]);
			resetForm();
		} else {
			alert(
				'Пожалуйста, выберите файл(ы) для добавления нового изображения.'
			);
		}
	};

	const handleRemoveImage = (key: string) => {
		const imageToRemove = images.find((img) => img.key === key);
		if (imageToRemove && !('id' in imageToRemove)) {
			// Очищаем URL только для новых файлов
			if (imageToRemove.type === 'SINGLE') {
				URL.revokeObjectURL(imageToRemove.previewUrl);
			} else {
				URL.revokeObjectURL(imageToRemove.previewUrlBefore);
				URL.revokeObjectURL(imageToRemove.previewUrlAfter);
			}
		}
		setImages(images.filter((img) => img.key !== key));
	};

	const handleSave = () => {
		onSave(images);
		onClose();
	};

	const getPreviewUrls = (
		img: ManagedImagePayload
	): {
		single?: string;
		before?: string;
		after?: string;
	} => {
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
		<div
			className='fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4'
			onClick={onClose}
		>
			<div
				className='bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<h2 className='text-xl font-bold text-white'>
						Менеджер изображений
					</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-white'
					>
						<X size={24} />
					</button>
				</div>

				<div className='flex-grow p-4 overflow-y-auto'>
					{/* Форма добавления осталась без изменений */}
					<div className='bg-gray-700 p-4 rounded-lg mb-6'>
						<h3 className='font-semibold text-lg mb-3'>
							Добавить новое изображение
						</h3>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Тип изображения
							</label>
							<div className='flex gap-4'>
								<button
									onClick={() => setNewImageType('single')}
									className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 ${
										newImageType === 'single'
											? 'bg-red-600 text-white'
											: 'bg-gray-600 hover:bg-gray-500'
									}`}
								>
									<Image size={16} /> Одиночное
								</button>
								<button
									onClick={() => setNewImageType('beforeAfter')}
									className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 ${
										newImageType === 'beforeAfter'
											? 'bg-red-600 text-white'
											: 'bg-gray-600 hover:bg-gray-500'
									}`}
								>
									<Images size={16} /> До/После
								</button>
							</div>
						</div>
						{newImageType === 'single' ? (
							<div className='mb-4'>
								<label
									htmlFor='singleFile'
									className='block text-sm font-medium text-gray-300 mb-1'
								>
									Файл изображения
								</label>
								<input
									id='singleFile'
									type='file'
									ref={singleFileRef}
									accept='image/*'
									className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
								/>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
								<div>
									<label
										htmlFor='beforeFile'
										className='block text-sm font-medium text-gray-300 mb-1'
									>
										Файл "До"
									</label>
									<input
										id='beforeFile'
										type='file'
										ref={beforeFileRef}
										accept='image/*'
										className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
									/>
								</div>
								<div>
									<label
										htmlFor='afterFile'
										className='block text-sm font-medium text-gray-300 mb-1'
									>
										Файл "После"
									</label>
									<input
										id='afterFile'
										type='file'
										ref={afterFileRef}
										accept='image/*'
										className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
									/>
								</div>
							</div>
						)}
						<div className='mb-4'>
							<label
								htmlFor='imgDesc'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Описание (необязательно)
							</label>
							<input
								id='imgDesc'
								type='text'
								value={newImageDesc}
								onChange={(e) => setNewImageDesc(e.target.value)}
								className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500'
								placeholder='Например, "Полировка капота"'
							/>
						</div>
						<button
							onClick={handleAddImage}
							className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2'
						>
							<Plus size={20} /> Добавить
						</button>
					</div>

					<div className='space-y-3'>
						{images.length === 0 ? (
							<p className='text-center text-gray-400 py-4'>
								Изображения не добавлены.
							</p>
						) : (
							images.map((img) => {
								const previews = getPreviewUrls(img);
								const isNew = !('id' in img);

								return (
									<div
										key={img.key}
										className={`p-3 rounded-lg flex items-center justify-between gap-4 ${
											isNew ? 'bg-green-900/50' : 'bg-gray-700'
										}`}
									>
										<div className='flex-shrink-0'>
											{img.type === 'SINGLE' ? (
												<img
													src={previews.single}
													alt={img.description}
													className='w-16 h-16 object-cover rounded bg-gray-800'
												/>
											) : (
												<div className='flex gap-1'>
													<img
														src={previews.before}
														alt={`До - ${img.description}`}
														className='w-12 h-12 object-cover rounded bg-gray-800'
													/>
													<img
														src={previews.after}
														alt={`После - ${img.description}`}
														className='w-12 h-12 object-cover rounded bg-gray-800'
													/>
												</div>
											)}
										</div>
										<div className='flex-grow min-w-0'>
											<p
												className='font-semibold truncate'
												title={img.description}
											>
												{img.description}
											</p>
											<p className='text-xs text-gray-400'>
												{img.type === 'SINGLE' ? 'Одиночное' : 'До/После'}{' '}
												-{' '}
												<span
													className={
														isNew ? 'text-green-400' : 'text-blue-400'
													}
												>
													{isNew ? 'Новое' : 'Сохраненное'}
												</span>
											</p>
										</div>
										<button
											onClick={() => handleRemoveImage(img.key)}
											className='text-gray-400 hover:text-red-500 p-2'
										>
											<Trash2 size={20} />
										</button>
									</div>
								);
							})
						)}
					</div>
				</div>

				<div className='flex justify-end p-4 border-t border-gray-700'>
					<button
						onClick={onClose}
						className='bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md mr-2'
					>
						Отмена
					</button>
					<button
						onClick={handleSave}
						className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md'
					>
						Сохранить и закрыть
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImageManagerModal;
