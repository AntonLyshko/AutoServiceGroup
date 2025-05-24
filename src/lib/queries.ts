import { gql } from 'graphql-request';

// Фрагмент для типичных полей изображения
// Теперь он применяется к типу UploadFile и запрашивает поля напрямую
const IMAGE_FRAGMENT = gql`
	fragment ImageFragment on UploadFile {
		documentId # ID самого файла, если нужно
		url
		alternativeText
		width
		height
	}
`;

// Запрос данных для Hero
export const GET_HERO_DATA_QUERY = gql`
	${IMAGE_FRAGMENT}
	# Включаем фрагмент
	query GetHeroData {
		hero {
			# documentId # Необязательно для синглтона, если не нужен ID
			title
			secondTitle
			description
			backgroundImage {
				# Новое поле для фонового изображения
				...ImageFragment
			}
		}
	}
`;

// Запрос данных для "Почему выбирают нас"
export const GET_WHY_CHOOSE_US_DATA_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetWhyChooseUsData {
		whyChooseUs {
			# documentId
			title
			# shortDescription # Если понадобится, можно раскомментировать
			fullDescription # JSON
			imageUrl {
				...ImageFragment
			}
		}
	}
`;

// Запрос всех услуг
export const GET_SERVICES_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetServices {
		services(pagination: { limit: 100 }, sort: "service_id:asc") {
			documentId
			title
			service_id
			shortDescription
			fullDescription # Это JSON поле, обработаем его при трансформации
			image {
				...ImageFragment
			}
		}
	}
`;

// Запрос одной услуги по ее service_id (слагу)
export const GET_SERVICE_BY_SLUG_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetServiceBySlug($serviceIdSlug: String!) {
		services(
			filters: { service_id: { eq: $serviceIdSlug } }
			pagination: { limit: 1 }
		) {
			documentId
			title
			service_id
			shortDescription
			fullDescription # JSON
			image {
				...ImageFragment
			}
		}
	}
`;

// Запрос примеров работ для GalleryPreview и страницы /gallery
export const GET_WORK_EXAMPLES_FOR_PREVIEW_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetWorkExamplesForPreview {
		workExamples(pagination: { limit: 100 }, sort: "completionDate:desc") {
			documentId
			title
			description
			mainPreviewImage {
				...ImageFragment
			}
			gallery_items(pagination: { limit: 1 }) {
				documentId
				title
				description
				type
				imageUrl {
					...ImageFragment
				}
				beforeImage {
					...ImageFragment
				}
				afterImage {
					...ImageFragment
				}
			}
		}
	}
`;

// Запрос одного примера работы со всеми его элементами галереи для страницы /work-examples/:id
export const GET_WORK_EXAMPLE_BY_ID_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetWorkExampleById($workExampleDocumentId: ID!) {
		workExample(documentId: $workExampleDocumentId) {
			documentId
			title
			description # JSON
			mainPreviewImage {
				...ImageFragment
			}
			completionDate
			gallery_items(pagination: { limit: 50 }) {
				documentId
				title
				description
				type
				imageUrl {
					...ImageFragment
				}
				beforeImage {
					...ImageFragment
				}
				afterImage {
					...ImageFragment
				}
			}
		}
	}
`;

// Запрос списка автомобилей для превью (секция "Авто на продажу")
export const GET_CARS_FOR_SALE_PREVIEW_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetCarsForSalePreview {
		cars(pagination: { limit: 100 }, sort: "createdAt:desc") {
			# Сортировка по дате создания, можно изменить
			documentId
			title
			cost
			images(pagination: { limit: 1 }) {
				# Запрашиваем только первое изображение
				...ImageFragment
			}
		}
	}
`;

// Запрос одного автомобиля по его documentId для страницы /cars/:id
export const GET_CAR_BY_ID_QUERY = gql`
	${IMAGE_FRAGMENT}
	query GetCarById($carDocumentId: ID!) {
		car(documentId: $carDocumentId) {
			documentId
			title
			description # JSON
			cost
			images(pagination: { limit: 20 }) {
				# Запрашиваем все изображения (до 20)
				...ImageFragment
			}
		}
	}
`;

// Запрос общих настроек сайта (телефон, адрес)
export const GET_GENERAL_DATA_QUERY = gql`
	query GetGeneralData {
		general {
			phone
			address
		}
	}
`;
