import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService } from '../../services/apiService';
import {
	ImageFilePayload,
	ImageMeta,
	ManagedImagePayload,
} from '../../types/api';
import Loader from '../../components/Loader';
import ImageManagerModal from '../../components/admin/ImageManagerModal';
import ImagePreviewGrid from '../../components/admin/ImagePreviewGrid';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCreatePage: React.FC = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<ImageFilePayload[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const mutation = useMutation({
		mutationFn: createService,
		onSuccess: (data) => {
			alert('Услуга успешно создана!');
			queryClient.invalidateQueries({ queryKey: ['services'] });
			navigate(`/services/${data.id}`);
		},
		onError: (error) => {
			alert(`Ошибка при создании: ${error.message}`);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);

		const imageMeta: ImageMeta[] = [];
		images.forEach((img) => {
			imageMeta.push({ type: img.type, description: img.description });
			if (img.type === 'SINGLE') {
				formData.append('images', img.file, img.file.name);
			} else {
				formData.append('images', img.fileBefore, img.fileBefore.name);
				formData.append('images', img.fileAfter, img.fileAfter.name);
			}
		});

		if (imageMeta.length > 0) {
			formData.append('imageMeta', JSON.stringify(imageMeta));
		}

		mutation.mutate(formData);
	};

	const handleImageSave = (managedImages: ManagedImagePayload[]) => {
		const newImageFiles = managedImages.filter(
			(img): img is ImageFilePayload => !('id' in img)
		);
		setImages(newImageFiles);
	};

	const handleRemoveImage = (key: string) => {
		setImages((currentImages) =>
			currentImages.filter((img) => img.key !== key)
		);
	};

	return (
		<>
			<div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
				<h1 className='text-2xl font-bold mb-6'>Создать запись: Услуга</h1>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-300 mb-1'
						>
							Название услуги
						</label>
						<input
							id='name'
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500'
						/>
					</div>
					<div>
						<label
							htmlFor='description'
							className='block text-sm font-medium text-gray-300 mb-1'
						>
							Описание (поддерживает Markdown)
						</label>
						<textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							rows={8}
							className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500'
						/>
					</div>

					<ImagePreviewGrid
						images={images}
						onManageClick={() => setIsModalOpen(true)}
						onRemoveClick={handleRemoveImage}
					/>

					<div className='pt-4'>
						<button
							type='submit'
							disabled={mutation.isPending}
							className='w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 disabled:bg-gray-500'
						>
							{mutation.isPending ? (
								<Loader
									size='sm'
									spinnerClassName='border-white border-t-transparent'
								/>
							) : (
								<>
									<Save size={20} className='mr-2' />
									Создать услугу
								</>
							)}
						</button>
					</div>
				</form>
			</div>
			<ImageManagerModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleImageSave}
				initialImages={images}
			/>
		</>
	);
};

export default ServiceCreatePage;
