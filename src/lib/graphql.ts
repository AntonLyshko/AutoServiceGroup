import { GraphQLClient } from 'graphql-request';

export const API_URL = 'http://localhost:1337'; // Замените, если ваш API на другом URL
export const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;
const API_TOKEN =
	'2ed8d43c7c2dc13fcfa7a2c1298eef50f46ddeabb807465e90769f60637f15ea2597d96eab1e23a9b80aa0770b816601579a86bb22c73a348fba3187a281faf9a44afd4927bd51a77e45e048c00919485792de5ddb07004e4a2af40f36b93a9e51520dd338f3dbf49e25a3d36bc80aac68951136c4ec194c11f2343118a75684';

export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
	headers: {
		authorization: `Bearer ${API_TOKEN}`,
	},
});

// Вспомогательная функция для получения полного URL изображения
export const getStrapiURL = (path = '') => {
	if (!path) {
		// Можно вернуть URL для плейсхолдера по умолчанию
		return '/placeholder.png'; // Убедитесь, что у вас есть такой файл в public или обработайте иначе
	}
	if (path.startsWith('http') || path.startsWith('//')) {
		return path; // Если URL уже абсолютный
	}
	return `${API_URL}${path}`;
};
