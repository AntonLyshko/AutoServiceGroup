import {
	RestApiCar,
	RestApiImage,
	RestApiService,
	RestApiSettings,
	RestApiWorkExample,
	SiteSettings,
	GalleryItem,
	TransformedService,
	TransformedWorkExamplePreview,
	TransformedWorkExamplePageData,
	TransformedCarPreview,
	TransformedCarPageData,
	ImageMeta,
} from '../types/api';
import {
	formatDisplayPhoneNumber,
	formatPhoneNumberForTelLink,
} from '../lib/utils';

// Базовый URL вашего бэкенда
const API_BASE_URL = 'http://localhost:3001';
const API_PREFIX = '/api';

// Вспомогательная функция для выполнения GET запросов
async function apiFetch<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`);
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error || `Request failed with status ${response.status}`
		);
	}
	return response.json();
}

// Вспомогательная функция для POST, PUT, DELETE
// Теперь корректно обрабатывает и JSON, и FormData
async function apiMutate<T>(
	endpoint: string,
	method: 'POST' | 'PUT' | 'DELETE',
	body?: any
): Promise<T> {
	const isFormData = body instanceof FormData;

	const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
		method,
		headers: isFormData ? {} : { 'Content-Type': 'application/json' },
		body: isFormData ? body : body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error || `Request failed with status ${response.status}`
		);
	}

	if (response.status === 204) {
		return {} as T; // Для DELETE запросов
	}

	return response.json();
}

// Вспомогательная функция для формирования полного URL изображения
function getFullImageUrl(relativePath: string | null | undefined): string {
	if (!relativePath) {
		return '/placeholder.png'; // Путь к вашему изображению-заглушке
	}
	// Если путь уже абсолютный, возвращаем как есть
	if (relativePath.startsWith('http') || relativePath.startsWith('//')) {
		return relativePath;
	}
	return `${API_BASE_URL}${relativePath}`;
}

// Вспомогательная функция для форматирования номера для WhatsApp
const formatPhoneNumberForWhatsApp = (
	phone: string | undefined | null
): string => {
	if (!phone) return '';
	// Оставляет только цифры, удаляя +, (, ), - и пробелы
	let cleaned = phone.replace(/[^\d]/g, '');
	// Если номер начинается с 8, заменяем на 7 (стандарт для РФ)
	if (cleaned.startsWith('8') && cleaned.length === 11) {
		cleaned = '7' + cleaned.substring(1);
	}
	return cleaned;
};

// --- Трансформаторы данных ---

function transformRestApiImage(image: RestApiImage): GalleryItem {
	const baseItem = {
		id: image.id,
		title: image.description || 'Изображение',
		description: image.description || '',
	};

	if (image.type === 'BEFORE_AFTER') {
		return {
			...baseItem,
			type: 'beforeAfter',
			beforeImage: getFullImageUrl(image.urlBefore),
			afterImage: getFullImageUrl(image.urlAfter),
		};
	}

	return {
		...baseItem,
		type: 'single',
		imageUrl: getFullImageUrl(image.urlSingle),
	};
}

// --- Функции для вызова API ---

/**
 * Получает и трансформирует общие настройки сайта.
 */
export const fetchSettings = async (): Promise<SiteSettings | null> => {
	try {
		const settings = await apiFetch<RestApiSettings>('/settings');
		return {
			mainTitle: settings.mainTitle,
			mainSubtitle: settings.mainSubtitle,
			phoneNumber: formatDisplayPhoneNumber(settings.phoneNumber),
			phoneLink: formatPhoneNumberForTelLink(settings.phoneNumber),
			whatsappLink: `https://wa.me/${formatPhoneNumberForWhatsApp(
				settings.phoneNumber
			)}`,
			address: settings.address,
			workingHours: settings.workingHours,
		};
	} catch (error) {
		console.error('Ошибка при загрузке настроек сайта:', error);
		// Возвращаем дефолтные значения, чтобы сайт не падал
		return {
			mainTitle: 'Автосервис',
			mainSubtitle: 'ТрейдАвто-групп',
			phoneNumber: formatDisplayPhoneNumber('+79655118585'),
			phoneLink: formatPhoneNumberForTelLink('+79655118585'),
			whatsappLink: `https://wa.me/79655118585`,
			address: 'Березовский, Транспортников 42А',
			workingHours: 'Ежедневно: 10:00-22:00',
		};
	}
};

/**
 * Обновляет настройки сайта.
 */
export const updateSettings = (
	data: Partial<Omit<RestApiSettings, 'updatedAt'>>
): Promise<RestApiSettings> => {
	return apiMutate<RestApiSettings>('/settings', 'POST', data);
};

/**
 * Получает список всех услуг.
 */
export const fetchServices = async (): Promise<TransformedService[]> => {
	const services = await apiFetch<RestApiService[]>('/services');
	return services.map((service) => ({
		id: service.id,
		title: service.name,
		description: service.description,
		// Берем первое изображение как главное
		imageUrl: getFullImageUrl(service.images?.[0]?.urlSingle),
	}));
};

/**
 * Получает одну услугу по ID. Возвращает "сырые" данные с сервера.
 */
export const fetchServiceById = async (
	id: string
): Promise<RestApiService | null> => {
	try {
		const service = await apiFetch<RestApiService>(`/services/${id}`);
		// Дополняем URL изображений, чтобы они работали на клиенте
		if (service.images) {
			service.images = service.images.map((img) => ({
				...img,
				urlSingle: getFullImageUrl(img.urlSingle),
				urlBefore: getFullImageUrl(img.urlBefore),
				urlAfter: getFullImageUrl(img.urlAfter),
			}));
		}
		return service;
	} catch (error) {
		console.error(`Ошибка загрузки услуги с ID ${id}:`, error);
		return null;
	}
};

/**
 * Создает новую услугу с файлами.
 */
export const createService = (
	formData: FormData
): Promise<RestApiService> => {
	return apiMutate<RestApiService>('/services', 'POST', formData);
};

/**
 * Обновляет существующую услугу.
 */
export const updateService = (
	id: string,
	formData: FormData
): Promise<RestApiService> => {
	return apiMutate<RestApiService>(`/services/${id}`, 'PUT', formData);
};

/**
 * Удаляет услугу по ID.
 */
export const deleteService = (id: string): Promise<void> => {
	return apiMutate<void>(`/services/${id}`, 'DELETE');
};

/**
 * Получает список всех примеров работ для галереи.
 */
export const fetchWorkExamples = async (): Promise<
	TransformedWorkExamplePreview[]
> => {
	const workExamples = await apiFetch<RestApiWorkExample[]>(
		'/work-examples'
	);
	return workExamples
		.map((we) => {
			if (!we.images || we.images.length === 0) {
				return null; // Пропускаем примеры без изображений
			}
			return {
				id: we.id,
				title: we.name,
				// Сокращаем описание для превью
				description:
					we.description.length > 100
						? we.description.substring(0, 100) + '...'
						: we.description,
				previewImage: transformRestApiImage(we.images[0]),
			};
		})
		.filter(
			(item): item is TransformedWorkExamplePreview => item !== null
		);
};

/**
 * Получает один пример работы по ID. Возвращает "сырые" данные с сервера.
 */
export const fetchWorkExampleById = async (
	id: string
): Promise<RestApiWorkExample | null> => {
	try {
		const we = await apiFetch<RestApiWorkExample>(`/work-examples/${id}`);
		// Дополняем URL изображений
		if (we.images) {
			we.images = we.images.map((img) => ({
				...img,
				urlSingle: getFullImageUrl(img.urlSingle),
				urlBefore: getFullImageUrl(img.urlBefore),
				urlAfter: getFullImageUrl(img.urlAfter),
			}));
		}
		return we;
	} catch (error) {
		console.error(`Ошибка загрузки примера работы с ID ${id}:`, error);
		return null;
	}
};

/**
 * Создает новый пример работы с файлами.
 */
export const createWorkExample = (
	formData: FormData
): Promise<RestApiWorkExample> => {
	return apiMutate<RestApiWorkExample>('/work-examples', 'POST', formData);
};

/**
 * Обновляет существующий пример работы.
 */
export const updateWorkExample = (
	id: string,
	formData: FormData
): Promise<RestApiWorkExample> => {
	return apiMutate<RestApiWorkExample>(
		`/work-examples/${id}`,
		'PUT',
		formData
	);
};

/**
 * Удаляет пример работы по ID.
 */
export const deleteWorkExample = (id: string): Promise<void> => {
	return apiMutate<void>(`/work-examples/${id}`, 'DELETE');
};

/**
 * Получает список всех автомобилей для продажи.
 */
export const fetchCars = async (): Promise<TransformedCarPreview[]> => {
	const cars = await apiFetch<RestApiCar[]>('/cars');
	return cars.map((car) => ({
		id: car.id,
		title: car.name,
		cost: new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
		}).format(car.price),
		imageUrl: getFullImageUrl(car.images?.[0]?.urlSingle),
	}));
};

/**
 * Получает один автомобиль по ID. Возвращает "сырые" данные с сервера.
 */
export const fetchCarById = async (
	id: string
): Promise<RestApiCar | null> => {
	try {
		const car = await apiFetch<RestApiCar>(`/cars/${id}`);
		// Дополняем URL изображений
		if (car.images) {
			car.images = car.images.map((img) => ({
				...img,
				urlSingle: getFullImageUrl(img.urlSingle),
				urlBefore: getFullImageUrl(img.urlBefore),
				urlAfter: getFullImageUrl(img.urlAfter),
			}));
		}
		return car;
	} catch (error) {
		console.error(`Ошибка загрузки автомобиля с ID ${id}:`, error);
		return null;
	}
};

/**
 * Создает новый автомобиль с файлами.
 */
export const createCar = (formData: FormData): Promise<RestApiCar> => {
	return apiMutate<RestApiCar>('/cars', 'POST', formData);
};

/**
 * Обновляет существующий автомобиль.
 */
export const updateCar = (
	id: string,
	formData: FormData
): Promise<RestApiCar> => {
	return apiMutate<RestApiCar>(`/cars/${id}`, 'PUT', formData);
};

/**
 * Удаляет автомобиль по ID.
 */
export const deleteCar = (id: string): Promise<void> => {
	return apiMutate<void>(`/cars/${id}`, 'DELETE');
};
