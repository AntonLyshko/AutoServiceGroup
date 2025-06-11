import React, { useState, useEffect } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
	fetchServiceById,
	updateService,
	deleteService,
} from '../../services/apiService';
import {
	ManagedImagePayload,
	ImageMeta,
	ExistingImagePayload,
	RestApiService,
	ImageFilePayload,
} from '../../types/api';
import Loader from '../../components/Loader';
import ImageManagerModal from '../../components/admin/ImageManagerModal';
import ImagePreviewGrid from '../../components/admin/ImagePreviewGrid';
import { Save, Trash2 } from 'lucide-react';

const ServiceEditPage: React.FC = () => {
	const { serviceId } = useParams<{ serviceId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [managedImages, setManagedImages] = useState<
		ManagedImagePayload[]
	>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: serviceData, isLoading: isLoadingService } =
		useQuery<RestApiService | null>({
			queryKey: ['service', serviceId],
			queryFn: () =>
				serviceId ? fetchServiceById(serviceId) : Promise.resolve(null),
			enabled: !!serviceId,
		});

	useEffect(() => {
		if (serviceData) {
			setName(serviceData.name);
			setDescription(serviceData.description);
			const existingImages: ExistingImagePayload[] =
				serviceData.images.map((img) => ({
					key: img.id,
					id: img.id,
					type: img.type,
					description: img.description || '',
					previewUrl: img.urlSingle || img.urlAfter || '',
					previewUrlBefore: img.urlBefore || undefined,
					previewUrlAfter: img.urlAfter || undefined,
				}));
			setManagedImages(existingImages);
		}
	}, [serviceData]);

	const updateMutation = useMutation({
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
			updateService(id, formData),
		onSuccess: (data) => {
			alert('Услуга успешно обновлена!');
			queryClient.invalidateQueries({ queryKey: ['services'] });
			queryClient.invalidateQueries({ queryKey: ['service', serviceId] });
			navigate(`/services/${data.id}`);
		},
		onError: (error) => {
			alert(`Ошибка при обновлении: ${error.message}`);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteService(id),
		onSuccess: () => {
			alert('Услуга успешно удалена!');
			queryClient.invalidateQueries({ queryKey: ['services'] });
			navigate('/admin/services');
		},
		onError: (error) => {
			alert(`Ошибка при удалении: ${error.message}`);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!serviceId) return;

		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);

		const imageIdsToKeep: string[] = [];
		const newImageMeta: ImageMeta[] = [];
		const newImageFiles: ImageFilePayload[] = [];

		managedImages.forEach((img) => {
			if ('id' in img) {
				imageIdsToKeep.push(img.id);
			} else {
				newImageFiles.push(img);
			}
		});

		newImageFiles.forEach((img) => {
			newImageMeta.push({
				type: img.type,
				description: img.description,
			});
			if (img.type === 'SINGLE') {
				formData.append('images', img.file, img.file.name);
			} else {
				formData.append('images', img.fileBefore, img.fileBefore.name);
				formData.append('images', img.fileAfter, img.fileAfter.name);
			}
		});

		formData.append('imageIdsToKeep', JSON.stringify(imageIdsToKeep));
		if (newImageMeta.length > 0) {
			formData.append('imageMeta', JSON.stringify(newImageMeta));
		}

		updateMutation.mutate({ id: serviceId, formData });
	};

	const handleDelete = () => {
		if (
			serviceId &&
			window.confirm('Вы уверены, что хотите удалить эту услугу?')
		) {
			deleteMutation.mutate(serviceId);
		}
	};

	const handleRemoveImage = (key: string) => {
		setManagedImages((currentImages) =>
			currentImages.filter((img) => img.key !== key)
		);
	};

	if (isLoadingService) {
		return <Loader size='lg' text='Загрузка данных услуги...' />;
	}

	if (!serviceData) {
		return <p>Услуга не найдена.</p>;
	}

	return (
		<>
			<div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold'>
						Редактирование: {serviceData.name}
					</h1>
					<button
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
						className='flex items-center bg-red-800 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50'
					>
						<Trash2 size={16} className='mr-2' />
						Удалить
					</button>
				</div>
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
						images={managedImages}
						onManageClick={() => setIsModalOpen(true)}
						onRemoveClick={handleRemoveImage}
					/>

					<div className='pt-4'>
						<button
							type='submit'
							disabled={updateMutation.isPending}
							className='w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 disabled:bg-gray-500'
						>
							{updateMutation.isPending ? (
								<Loader
									size='sm'
									spinnerClassName='border-white border-t-transparent'
								/>
							) : (
								<>
									<Save size={20} className='mr-2' />
									Сохранить изменения
								</>
							)}
						</button>
					</div>
				</form>
			</div>
			<ImageManagerModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={setManagedImages}
				initialImages={managedImages}
			/>
		</>
	);
};

export default ServiceEditPage;
