// src/types/api.ts

// Тип для блоков Strapi Rich Text (упрощенный, можно уточнить при необходимости)
export type StrapiRichTextBlock = {
	type: string;
	children: {
		type: string;
		text: string;
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
		strikethrough?: boolean;
		code?: boolean;
	}[];
	format?: 'ordered' | 'unordered';
	level?: number;
	// ... могут быть другие поля в зависимости от типа блока (image, link и т.д.)
};

// Тип для объекта изображения, как он приходит из GraphQL (поля из UploadFile)
export interface ApiImage {
	documentId?: string; // ID самого файла
	url: string;
	alternativeText?: string | null;
	width?: number | null;
	height?: number | null;
}

// Тип для Hero, как он приходит из GraphQL
export interface ApiHero {
	// documentId: string; // Singleton, ID может не быть или не использоваться
	title: string | null;
	secondTitle: string | null;
	description: string | null;
	backgroundImage?: ApiImage | null; // Добавлено поле для фонового изображения
}

// Ответ для запроса Hero
export interface HeroGraphQLResponse {
	hero: ApiHero | null;
}

// Тип для WhyChooseUs, как он приходит из GraphQL
export interface ApiWhyChooseUs {
	// documentId: string;
	title: string | null;
	// shortDescription: string | null; // Раскомментировать если будет использоваться
	fullDescription: StrapiRichTextBlock[] | any | null; // JSON (массив блоков Rich Text)
	imageUrl?: ApiImage | null;
}

// Ответ для запроса WhyChooseUs
export interface WhyChooseUsGraphQLResponse {
	whyChooseUs: ApiWhyChooseUs | null;
}

// Тип для Service, как он приходит из GraphQL
export interface ApiService {
	documentId: string; // Strapi ID
	title: string;
	service_id: string; // Наш слаг
	shortDescription: string;
	fullDescription: StrapiRichTextBlock[] | any | null; // JSON (массив блоков Rich Text)
	image?: ApiImage | null; // Поле изображения теперь напрямую ApiImage
}

// Ответ для запроса списка услуг
export interface ServicesGraphQLResponse {
	services: ApiService[];
}
// Ответ для запроса одной услуги (Strapi часто возвращает массив даже для одного элемента при фильтрации)
export interface ServiceGraphQLResponse {
	services: ApiService[];
}

// Тип для GalleryItem, как он приходит из GraphQL
export interface ApiGalleryItem {
	documentId: string;
	title: string;
	description: string | StrapiRichTextBlock[] | any | null; // Может быть простой строкой или Rich Text
	type: 'single' | 'beforeAfter';
	imageUrl?: ApiImage | null;
	beforeImage?: ApiImage | null;
	afterImage?: ApiImage | null;
}

// Тип для WorkExample, как он приходит из GraphQL
export interface ApiWorkExample {
	documentId: string;
	title: string;
	description: StrapiRichTextBlock[] | any | null; // JSON (массив блоков Rich Text)
	mainPreviewImage?: ApiImage | null;
	completionDate?: string | null;
	gallery_items: ApiGalleryItem[]; // Массив элементов галереи
}

// Ответ для запроса списка примеров работ
export interface WorkExamplesGraphQLResponse {
	workExamples: ApiWorkExample[];
}
// Ответ для запроса одного примера работы
export interface WorkExampleGraphQLResponse {
	workExample: ApiWorkExample | null; // Может быть null, если не найден
}

// Тип для Car, как он приходит из GraphQL
export interface ApiCar {
	documentId: string;
	title: string;
	description: StrapiRichTextBlock[] | any | null; // JSON (массив блоков Rich Text)
	cost: string | null;
	images: ApiImage[]; // Массив изображений
}

// Ответ для запроса списка автомобилей
export interface CarsGraphQLResponse {
	cars: ApiCar[];
}

// Ответ для запроса одного автомобиля
export interface CarGraphQLResponse {
	car: ApiCar | null;
}

// Тип для General (общие настройки сайта), как он приходит из GraphQL
export interface ApiGeneral {
	phone: string | null;
	address: string | null;
}

// Ответ для запроса General
export interface GeneralGraphQLResponse {
	general: ApiGeneral | null;
}

// --- Трансформированные типы для использования в компонентах ---

export interface TransformedHeroData {
	title: string;
	secondTitle: string;
	description: string;
	backgroundImageUrl: string; // Добавлено поле для URL фонового изображения
}

export interface TransformedWhyChooseUsData {
	title: string;
	fullDescriptionObject: StrapiRichTextBlock[] | null;
	imageUrl: string;
	features: string[]; // Извлеченные пункты из fullDescription (ранее 'services' для этого блока)
}

export interface TransformedService {
	strapiId: string;
	id: string; // Наш service_id (слаг)
	title: string;
	shortDescription: string;
	fullDescriptionObject: StrapiRichTextBlock[] | null; // Объект для рендерера
	imageUrl: string; // Полный URL
	services: string[]; // Список характеристик/подпунктов услуги, извлеченных из fullDescriptionObject
}

export interface TransformedGalleryItemBase {
	id: string; // documentId из ApiGalleryItem
	title: string;
	description: string; // Преобразовано в строку для простоты в карточках
}
export interface TransformedGallerySingleItem
	extends TransformedGalleryItemBase {
	type: 'single';
	imageUrl: string;
}
export interface TransformedGalleryBeforeAfterItem
	extends TransformedGalleryItemBase {
	type: 'beforeAfter';
	beforeImage: string;
	afterImage: string;
}
export type TransformedGalleryItem =
	| TransformedGallerySingleItem
	| TransformedGalleryBeforeAfterItem;

export interface TransformedWorkExamplePreviewItemBase {
	workExampleId: string; // documentId из ApiWorkExample
	originalTitle: string;
}
export type TransformedWorkExamplePreviewItem =
	| (TransformedGallerySingleItem & TransformedWorkExamplePreviewItemBase)
	| (TransformedGalleryBeforeAfterItem &
			TransformedWorkExamplePreviewItemBase);

export interface TransformedWorkExamplePageData {
	id: string; // documentId из ApiWorkExample
	title: string;
	descriptionObject: StrapiRichTextBlock[] | null; // Объект для рендерера
	mainPreviewImageUrl: string; // Полный URL
	galleryItems: TransformedGalleryItem[];
}

// Трансформированный тип для превью автомобиля в списке
export interface TransformedCarPreview {
	id: string; // documentId
	title: string;
	cost: string;
	imageUrl: string; // URL первого изображения
}

// Трансформированный тип для страницы автомобиля
export interface TransformedCarPageData {
	id: string; // documentId
	title: string;
	descriptionObject: StrapiRichTextBlock[] | null;
	cost: string;
	images: { url: string; alt: string }[]; // Массив URL изображений
}

// Трансформированный тип для общих настроек сайта
export interface TransformedGeneralData {
	phone: string;
	address: string;
	whatsappPhone: string; // Номер телефона, отформатированный для WhatsApp ссылки
}
