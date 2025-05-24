import { gqlClient, getStrapiURL } from '../lib/graphql';
import {
	GET_SERVICES_QUERY,
	GET_SERVICE_BY_SLUG_QUERY,
	GET_WORK_EXAMPLES_FOR_PREVIEW_QUERY,
	GET_WORK_EXAMPLE_BY_ID_QUERY,
	GET_HERO_DATA_QUERY,
	GET_WHY_CHOOSE_US_DATA_QUERY,
	GET_CARS_FOR_SALE_PREVIEW_QUERY,
	GET_CAR_BY_ID_QUERY,
	GET_GENERAL_DATA_QUERY,
} from '../lib/queries';
import {
	ServicesGraphQLResponse,
	ServiceGraphQLResponse,
	WorkExamplesGraphQLResponse,
	WorkExampleGraphQLResponse,
	HeroGraphQLResponse,
	WhyChooseUsGraphQLResponse,
	CarsGraphQLResponse,
	CarGraphQLResponse,
	GeneralGraphQLResponse,
	ApiService,
	ApiWorkExample,
	ApiGalleryItem,
	ApiImage,
	ApiHero,
	ApiWhyChooseUs,
	ApiCar,
	ApiGeneral,
	TransformedService,
	TransformedGalleryItem,
	TransformedWorkExamplePreviewItem,
	TransformedWorkExamplePageData,
	TransformedHeroData,
	TransformedWhyChooseUsData,
	TransformedCarPreview,
	TransformedCarPageData,
	TransformedGeneralData,
	StrapiRichTextBlock,
} from '../types/api';

const defaultHeroBackgroundImage = '/img/img_1.webp'; // Запасное изображение, если с бэка не придет

const transformApiImageToUrl = (
	apiImage: ApiImage | undefined | null
): string => {
	return getStrapiURL(apiImage?.url);
};

const extractTextFromRichText = (
	blocks: StrapiRichTextBlock[] | null | undefined
): string => {
	if (!blocks || !Array.isArray(blocks)) return '';
	return blocks
		.map((block) =>
			block.children.map((child) => child.text || '').join('')
		)
		.join('\n')
		.trim();
};

const extractListItemsFromRichText = (
	blocks: StrapiRichTextBlock[] | null | undefined
): string[] => {
	const items: string[] = [];
	if (!blocks || !Array.isArray(blocks)) return items;

	for (const block of blocks) {
		if (block.type === 'list' && Array.isArray(block.children)) {
			for (const listItem of block.children) {
				if (
					listItem.type === 'list-item' &&
					// @ts-ignore
					Array.isArray(listItem.children)
				) {
					// @ts-ignore
					const text = listItem.children
						// @ts-ignore
						.map((childNode) => childNode.text || '')
						.join('')
						.trim();
					if (text) {
						items.push(text);
					}
				}
			}
		}
	}
	return items;
};

const transformApiServiceToTransformedService = (
	apiService: ApiService
): TransformedService => {
	const richTextBlocks = apiService.fullDescription as
		| StrapiRichTextBlock[]
		| null;

	return {
		strapiId: apiService.documentId,
		id: apiService.service_id,
		title: apiService.title,
		shortDescription: apiService.shortDescription,
		fullDescriptionObject: richTextBlocks,
		imageUrl: transformApiImageToUrl(apiService.image),
		services: extractListItemsFromRichText(richTextBlocks),
	};
};

const transformApiGalleryItemToTransformed = (
	apiGalleryItem: ApiGalleryItem
): TransformedGalleryItem => {
	const descriptionText =
		typeof apiGalleryItem.description === 'string'
			? apiGalleryItem.description
			: extractTextFromRichText(
					apiGalleryItem.description as StrapiRichTextBlock[] | null
			  );

	const baseItem = {
		id: apiGalleryItem.documentId,
		title: apiGalleryItem.title,
		description: descriptionText,
	};

	if (apiGalleryItem.type === 'beforeAfter') {
		return {
			...baseItem,
			type: 'beforeAfter',
			beforeImage: transformApiImageToUrl(apiGalleryItem.beforeImage),
			afterImage: transformApiImageToUrl(apiGalleryItem.afterImage),
		};
	}
	return {
		...baseItem,
		type: 'single',
		imageUrl: transformApiImageToUrl(apiGalleryItem.imageUrl),
	};
};

const transformApiWorkExampleToPreviewItem = (
	apiWorkExample: ApiWorkExample
): TransformedWorkExamplePreviewItem => {
	const firstGalleryItem = apiWorkExample.gallery_items?.[0];
	const workExampleDescriptionText = extractTextFromRichText(
		apiWorkExample.description as StrapiRichTextBlock[] | null
	);

	if (firstGalleryItem) {
		const transformedFirstGalleryItem =
			transformApiGalleryItemToTransformed(firstGalleryItem);
		return {
			...transformedFirstGalleryItem,
			workExampleId: apiWorkExample.documentId,
			originalTitle: apiWorkExample.title,
			description:
				workExampleDescriptionText.substring(0, 150) +
				(workExampleDescriptionText.length > 150 ? '...' : ''),
		};
	}

	return {
		id: apiWorkExample.documentId,
		type: 'single',
		imageUrl: transformApiImageToUrl(apiWorkExample.mainPreviewImage),
		title: apiWorkExample.title,
		description:
			workExampleDescriptionText.substring(0, 150) +
			(workExampleDescriptionText.length > 150 ? '...' : ''),
		workExampleId: apiWorkExample.documentId,
		originalTitle: apiWorkExample.title,
	};
};

const transformApiWorkExampleToPageData = (
	apiWorkExample: ApiWorkExample
): TransformedWorkExamplePageData => {
	return {
		id: apiWorkExample.documentId,
		title: apiWorkExample.title,
		descriptionObject: apiWorkExample.description as
			| StrapiRichTextBlock[]
			| null,
		mainPreviewImageUrl: transformApiImageToUrl(
			apiWorkExample.mainPreviewImage
		),
		galleryItems: apiWorkExample.gallery_items.map(
			transformApiGalleryItemToTransformed
		),
	};
};

const transformApiHeroToTransformedData = (
	apiHero: ApiHero | null
): TransformedHeroData | null => {
	if (!apiHero) {
		// Возвращаем данные по умолчанию, если с бэка ничего не пришло
		return {
			title: 'Автосервис',
			secondTitle: 'ТрейдАвто-групп',
			description:
				'Профессиональный ремонт и обслуживание автомобилей любых марок с использованием современного оборудования и оригинальных запчастей.',
			backgroundImageUrl: defaultHeroBackgroundImage,
		};
	}
	const backgroundUrl = transformApiImageToUrl(apiHero.backgroundImage);
	return {
		title: apiHero.title || 'Автосервис',
		secondTitle: apiHero.secondTitle || 'ТрейдАвто-групп',
		description:
			apiHero.description ||
			'Профессиональный ремонт и обслуживание автомобилей любых марок с использованием современного оборудования и оригинальных запчастей.',
		backgroundImageUrl:
			backgroundUrl && backgroundUrl !== '/placeholder.png'
				? backgroundUrl
				: defaultHeroBackgroundImage,
	};
};

const transformApiWhyChooseUsToTransformedData = (
	apiWhyChooseUs: ApiWhyChooseUs | null
): TransformedWhyChooseUsData | null => {
	if (!apiWhyChooseUs) return null;

	const richTextBlocks = apiWhyChooseUs.fullDescription as
		| StrapiRichTextBlock[]
		| null;

	return {
		title: apiWhyChooseUs.title || 'Почему выбирают нас',
		fullDescriptionObject: richTextBlocks,
		imageUrl: transformApiImageToUrl(apiWhyChooseUs.imageUrl),
		features: extractListItemsFromRichText(richTextBlocks),
	};
};

const transformApiCarToPreview = (
	apiCar: ApiCar
): TransformedCarPreview => {
	const firstImage = apiCar.images?.[0];
	return {
		id: apiCar.documentId,
		title: apiCar.title || 'Название автомобиля отсутствует',
		cost: apiCar.cost || 'Цена не указана',
		imageUrl: transformApiImageToUrl(firstImage),
	};
};

const transformApiCarToPageData = (
	apiCar: ApiCar
): TransformedCarPageData => {
	return {
		id: apiCar.documentId,
		title: apiCar.title || 'Название автомобиля отсутствует',
		descriptionObject: apiCar.description as StrapiRichTextBlock[] | null,
		cost: apiCar.cost || 'Цена не указана',
		images: apiCar.images.map((img) => ({
			url: transformApiImageToUrl(img),
			alt: img.alternativeText || apiCar.title || 'Изображение автомобиля',
		})),
	};
};

const formatPhoneNumberForWhatsApp = (
	phone: string | undefined | null
): string => {
	if (!phone) return '';
	return phone.replace(/[^0-9]/g, ''); // Удаляет все нецифровые символы
};

const transformApiGeneralToTransformedData = (
	apiGeneral: ApiGeneral | null
): TransformedGeneralData | null => {
	if (!apiGeneral) return null;
	const defaultPhone = '+7 965 511 8585';
	const defaultAddress = 'Березовский, Транспортников 42А';

	const phone = apiGeneral.phone || defaultPhone;
	return {
		phone: phone,
		address: apiGeneral.address || defaultAddress,
		whatsappPhone: formatPhoneNumberForWhatsApp(phone),
	};
};

export const fetchHeroData =
	async (): Promise<TransformedHeroData | null> => {
		try {
			const response = await gqlClient.request<HeroGraphQLResponse>(
				GET_HERO_DATA_QUERY
			);
			return transformApiHeroToTransformedData(response.hero);
		} catch (error) {
			console.error('Ошибка при загрузке данных Hero:', error);
			// Возвращаем данные по умолчанию в случае ошибки
			return transformApiHeroToTransformedData(null);
		}
	};

export const fetchWhyChooseUsData =
	async (): Promise<TransformedWhyChooseUsData | null> => {
		const response = await gqlClient.request<WhyChooseUsGraphQLResponse>(
			GET_WHY_CHOOSE_US_DATA_QUERY
		);
		return transformApiWhyChooseUsToTransformedData(response.whyChooseUs);
	};

export const fetchServices = async (): Promise<TransformedService[]> => {
	const response = await gqlClient.request<ServicesGraphQLResponse>(
		GET_SERVICES_QUERY
	);
	return response.services
		.map(transformApiServiceToTransformedService)
		.filter((s): s is TransformedService => s !== null);
};

export const fetchServiceBySlug = async (
	serviceSlug: string
): Promise<TransformedService | null> => {
	const response = await gqlClient.request<ServiceGraphQLResponse>(
		GET_SERVICE_BY_SLUG_QUERY,
		{ serviceIdSlug: serviceSlug }
	);
	if (response.services && response.services.length > 0) {
		return transformApiServiceToTransformedService(response.services[0]);
	}
	return null;
};

export const fetchWorkExamplesForPreview = async (): Promise<
	TransformedWorkExamplePreviewItem[]
> => {
	const response = await gqlClient.request<WorkExamplesGraphQLResponse>(
		GET_WORK_EXAMPLES_FOR_PREVIEW_QUERY
	);
	return response.workExamples.map(transformApiWorkExampleToPreviewItem);
};

export const fetchWorkExampleById = async (
	workExampleDocumentId: string
): Promise<TransformedWorkExamplePageData | null> => {
	const response = await gqlClient.request<WorkExampleGraphQLResponse>(
		GET_WORK_EXAMPLE_BY_ID_QUERY,
		{ workExampleDocumentId }
	);
	if (response.workExample) {
		return transformApiWorkExampleToPageData(response.workExample);
	}
	return null;
};

export const fetchCarsForSalePreview = async (): Promise<
	TransformedCarPreview[]
> => {
	const response = await gqlClient.request<CarsGraphQLResponse>(
		GET_CARS_FOR_SALE_PREVIEW_QUERY
	);
	return response.cars.map(transformApiCarToPreview);
};

export const fetchCarById = async (
	carDocumentId: string
): Promise<TransformedCarPageData | null> => {
	const response = await gqlClient.request<CarGraphQLResponse>(
		GET_CAR_BY_ID_QUERY,
		{ carDocumentId }
	);
	if (response.car) {
		return transformApiCarToPageData(response.car);
	}
	return null;
};

export const fetchGeneralData =
	async (): Promise<TransformedGeneralData | null> => {
		try {
			const response = await gqlClient.request<GeneralGraphQLResponse>(
				GET_GENERAL_DATA_QUERY
			);
			return transformApiGeneralToTransformedData(response.general);
		} catch (error) {
			console.error('Ошибка при загрузке общих данных:', error);
			// Возвращаем дефолтные значения в случае ошибки, чтобы сайт не падал
			return {
				phone: '+7 965 511 8585',
				address: 'Березовский, Транспортников 42А',
				whatsappPhone: '79655118585',
			};
		}
	};
