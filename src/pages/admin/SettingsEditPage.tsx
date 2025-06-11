import React, { useEffect } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { fetchSettings, updateSettings } from '../../services/apiService';
import { RestApiSettings } from '../../types/api';
import Loader from '../../components/Loader';
import { Save } from 'lucide-react';

type SettingsFormData = Omit<RestApiSettings, 'updatedAt'>;

const SettingsEditPage: React.FC = () => {
	const queryClient = useQueryClient();
	const [formData, setFormData] = React.useState<
		Partial<SettingsFormData>
	>({});

	const { data: settings, isLoading } = useQuery({
		queryKey: ['siteSettings'],
		queryFn: async () => {
			// fetchSettings возвращает трансформированные данные, нам нужны сырые
			const response = await fetch('http://localhost:3001/api/settings');
			if (!response.ok) throw new Error('Network response was not ok');
			return (await response.json()) as RestApiSettings;
		},
	});

	const mutation = useMutation({
		mutationFn: (newSettings: Partial<SettingsFormData>) =>
			updateSettings(newSettings),
		onSuccess: () => {
			alert('Настройки успешно обновлены!');
			// Инвалидируем кеш, чтобы на всем сайте подгрузились новые данные
			queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
		},
		onError: (error) => {
			alert(`Ошибка при обновлении: ${error.message}`);
		},
	});

	useEffect(() => {
		if (settings) {
			setFormData(settings);
		}
	}, [settings]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader size='lg' text='Загрузка настроек...' />
			</div>
		);
	}

	const renderInput = (
		name: keyof SettingsFormData,
		label: string,
		placeholder: string = ''
	) => (
		<div>
			<label
				htmlFor={name}
				className='block text-sm font-medium text-gray-300 mb-1'
			>
				{label}
			</label>
			<input
				type='text'
				id={name}
				name={name}
				value={formData[name] || ''}
				onChange={handleChange}
				placeholder={placeholder}
				className='w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500'
			/>
		</div>
	);

	return (
		<div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
			<h1 className='text-2xl font-bold mb-6'>Редактирование настроек</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{renderInput('mainTitle', 'Главный заголовок')}
				{renderInput('mainSubtitle', 'Подзаголовок')}
				{renderInput('phoneNumber', 'Номер телефона', '+79991234567')}
				{renderInput('address', 'Адрес')}
				{renderInput(
					'workingHours',
					'Часы работы',
					'Ежедневно: 10:00-22:00'
				)}
				{renderInput('socialInstagram', 'Ссылка на Instagram')}
				{renderInput('socialVk', 'Ссылка на VK')}

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
								Сохранить изменения
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default SettingsEditPage;
