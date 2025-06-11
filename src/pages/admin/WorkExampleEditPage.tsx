import React, { useState, useEffect } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
	fetchWorkExampleById,
	updateWorkExample,
	deleteWorkExample,
	fetchServices,
} from '../../services/apiService';
import {
	ManagedImagePayload,
	ImageMeta,
	ExistingImagePayload,
	RestApiWorkExample,
	TransformedService,
	ImageFilePayload,
} from '../../types/api';
import Loader from '../../components/Loader';
import ImageManagerModal from '../../components/admin/ImageManagerModal';
import ImagePreviewGrid from '../../components/admin/ImagePreviewGrid';
import { Save, Trash2 } from 'lucide-react';

const WorkExampleEditPage: React.FC = () => {
	const { workExampleId } = useParams<{ workExampleId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [name, setName] = useState('');
	const [date, setDate] = useState('');
	const [description, setDescription] = useState('');
	const [serviceId, setServiceId] = useState('');
	const [managedImages, setManagedImages] = useState<
		ManagedImagePayload[]
	>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: services, isLoading: isLoadingServices } = useQuery<
		TransformedService[]
	>({
		queryKey: ['services'],
		queryFn: fetchServices,
	});

	const { data: workExampleData, isLoading: isLoadingWorkExample } =
		useQuery<RestApiWorkExample | null>({
			queryKey: ['workExampleData', workExampleId],
			queryFn: () =>
				workExampleId
					? fetchWorkExampleById(workExampleId)
					: Promise.resolve(null),
			enabled: !!workExampleId,
		});

	useEffect(() => {
		if (workExampleData) {
			setName(workExampleData.name);
			setDate(new Date(workExampleData.date).toISOString().split('T')[0]);
			setDescription(workExampleData.description);
			setServiceId(workExampleData.serviceId);
			const existingImages: ExistingImagePayload[] =
				workExampleData.images.map((img) => ({
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
	}, [workExampleData]);

	const updateMutation = useMutation({
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
			updateWorkExample(id, formData),
		onSuccess: (data) => {
			alert('Пример работы успешно обновлен!');
			queryClient.invalidateQueries({ queryKey: ['workExamples'] });
			queryClient.invalidateQueries({
				queryKey: ['workExampleData', workExampleId],
			});
			navigate(`/work-examples/${data.id}`);
		},
		onError: (error) => {
			alert(`Ошибка при обновлении: ${error.message}`);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteWorkExample(id),
		onSuccess: () => {
			alert('Пример работы успешно удален!');
			queryClient.invalidateQueries({ queryKey: ['workExamples'] });
			navigate('/admin/work-examples');
		},
		onError: (error) => {
			alert(`Ошибка при удалении: ${error.message}`);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!workExampleId || !serviceId) {
			alert('Пожалуйста, выберите связанную услугу.');
			return;
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('date', new Date(date).toISOString());
		formData.append('description', description);
		formData.append('serviceId', serviceId);

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

		updateMutation.mutate({ id: workExampleId, formData });
	};

	const handleDelete = () => {
		if (
			workExampleId &&
			window.confirm('Вы уверены, что хотите удалить этот пример работы?')
		) {
			deleteMutation.mutate(workExampleId);
		}
	};

	const handleRemoveImage = (key: string) => {
		setManagedImages((currentImages) =>
			currentImages.filter((img) => img.key !== key)
		);
	};

	if (isLoadingWorkExample || isLoadingServices) {
		return <Loader size='lg' text='Загрузка данных...' />;
	}

	if (!workExampleData) {
		return <p>Пример работы не найден.</p>;
	}

	return (
		<>
			<div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold'>
						Редактирование: {workExampleData.name}
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
							Название работы
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
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label
								htmlFor='serviceId'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Связанная услуга
							</label>
							<select
								id='serviceId'
								value={serviceId}
								onChange={(e) => setServiceId(e.target.value)}
								required
								className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500'
							>
								<option value='' disabled>
									Выберите услугу
								</option>
								{services?.map((service) => (
									<option key={service.id} value={service.id}>
										{service.title}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor='date'
								className='block text-sm font-medium text-gray-300 mb-1'
							>
								Дата выполнения
							</label>
							<input
								id='date'
								type='date'
								value={date}
								onChange={(e) => setDate(e.target.value)}
								required
								className='w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500'
							/>
						</div>
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
							rows={6}
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

export default WorkExampleEditPage;
