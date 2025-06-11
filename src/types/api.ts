// src/types/api.ts

// --- Типы, соответствующие REST API Schema ---

/**
 * Модель изображения, как она приходит с REST API.
 */
export interface RestApiImage {
	id: string;
	description: string | null;
	type: 'SINGLE' | 'BEFORE_AFTER';
	urlSingle: string | null;
	urlBefore: string | null;
	urlAfter: string | null;
	carId: string | null;
	serviceId: string | null;
	workExampleId: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Модель автомобиля, как она приходит с REST API.
 */
export interface RestApiCar {
	id: string;
	name: string;
	price: number;
	description: string; // Markdown
	images: RestApiImage[];
	createdAt: string;
	updatedAt: string;
}

/**
 * Модель услуги, как она приходит с REST API.
 */
export interface RestApiService {
	id: string;
	name: string;
	description: string; // Markdown
	images: RestApiImage[];
	workExamples: RestApiWorkExample[];
	createdAt: string;
	updatedAt: string;
}

/**
 * Модель примера работы, как она приходит с REST API.
 */
export interface RestApiWorkExample {
	id: string;
	name: string;
	date: string;
	description: string; // Markdown
	serviceId: string;
	service?: RestApiService; // Может быть включен при детальном запросе
	images: RestApiImage[];
	createdAt: string;
	updatedAt: string;
}

/**
 * Модель настроек сайта, как она приходит с REST API.
 */
export interface RestApiSettings {
	mainTitle: string;
	mainSubtitle: string;
	phoneNumber: string;
	socialInstagram: string;
	socialVk: string;
	address: string;
	workingHours: string;
	updatedAt: string;
}

// --- Типы для создания новых записей (Payloads) ---

/**
 * Внутренний тип для UI для управления файлами перед загрузкой.
 */
export type ImageFilePayload =
	| {
			// Уникальный ключ для React-списков
			key: string;
			type: 'SINGLE';
			file: File;
			description: string;
			previewUrl: string;
	  }
	| {
			// Уникальный ключ для React-списков
			key: string;
			type: 'BEFORE_AFTER';
			fileBefore: File;
			fileAfter: File;
			description: string;
			previewUrlBefore: string;
			previewUrlAfter: string;
	  };

/**
 * Внутренний тип для UI для представления уже загруженного изображения в модалке.
 */
export interface ExistingImagePayload {
	key: string; // db id
	id: string; // db id
	type: 'SINGLE' | 'BEFORE_AFTER';
	description: string;
	// Для рендеринга
	previewUrl: string;
	previewUrlBefore?: string;
	previewUrlAfter?: string;
}

/**
 * Объединенный тип для ImageManagerModal, может содержать как новые, так и существующие изображения.
 */
export type ManagedImagePayload = ImageFilePayload | ExistingImagePayload;

/**
 * Тип для создания мета-информации для изображений при отправке FormData.
 */
export type ImageMeta = {
	type: 'SINGLE' | 'BEFORE_AFTER';
	description: string;
};

// Полезные нагрузки для функций создания теперь будут формироваться внутри страниц
// и передаваться в виде FormData. Эти интерфейсы описывают данные, необходимые для
// формирования FormData.

export interface CreateCarData {
	name: string;
	price: number;
	description: string;
	images: ImageFilePayload[];
}

export interface CreateServiceData {
	name: string;
	description: string;
	images: ImageFilePayload[];
}

export interface CreateWorkExampleData {
	name: string;
	date: string; // ISO-8601
	description: string;
	serviceId: string;
	images: ImageFilePayload[];
}

// --- Трансформированные типы для использования в компонентах ---

/**
 * Общие настройки сайта, подготовленные для использования в компонентах.
 */
export interface SiteSettings {
	mainTitle: string;
	mainSubtitle: string;
	phoneNumber: string;
	phoneLink: string; // для href="tel:..."
	whatsappLink: string; // для href="https://wa.me/..."
	address: string;
	workingHours: string;
}

/**
 * Базовый тип для элемента изображения в галерее (одиночное или до/после).
 */
export interface GalleryItemBase {
	id: string;
	title: string;
	description: string;
}

/**
 * Одиночное изображение в галерее.
 */
export interface GallerySingleItem extends GalleryItemBase {
	type: 'single';
	imageUrl: string;
}

/**
 * Сравнение "до/после" в галерее.
 */
export interface GalleryBeforeAfterItem extends GalleryItemBase {
	type: 'beforeAfter';
	beforeImage: string;
	afterImage: string;
}

export type GalleryItem = GallerySingleItem | GalleryBeforeAfterItem;

/**
 * Услуга, подготовленная для отображения (например, в ServiceCard).
 */
export interface TransformedService {
	id: string;
	title: string;
	description: string; // Markdown
	imageUrl: string;
}

/**
 * Пример работы, подготовленный для превью в галерее.
 */
export interface TransformedWorkExamplePreview {
	id: string; // ID самого WorkExample
	title: string; // Название WorkExample
	description: string; // Описание WorkExample (сокращенное)
	previewImage: GalleryItem; // Первый элемент из `images` для отображения
}

/**
 * Полные данные примера работы для страницы /work-examples/:id
 */
export interface TransformedWorkExamplePageData {
	id: string;
	title: string;
	description: string; // Markdown
	galleryItems: GalleryItem[];
}

/**
 * Автомобиль, подготовленный для превью в списке.
 */
export interface TransformedCarPreview {
	id: string;
	title: string;
	cost: string; // Уже отформатированная цена
	imageUrl: string;
}

/**
 * Полные данные автомобиля для страницы /cars/:id
 */
export interface TransformedCarPageData {
	id: string;
	title: string;
	cost: string; // Отформатированная цена
	description: string; // Markdown
	images: GalleryItem[];
}
