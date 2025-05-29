import { GraphQLClient } from 'graphql-request';

export const API_URL = 'https://tradeauto-group.ru';
export const GRAPHQL_ENDPOINT = `${API_URL}/graphql`;
const API_TOKEN =
	'2ed8d43c7c2dc13fcfa7a2c1298eef50f46ddeabb807465e90769f60637f15ea2597d96eab1e23a9b80aa0770b816601579a86bb22c73a348fba3187a281faf9a44afd4927bd51a77e45e048c00919485792de5ddb07004e4a2af40f36b93a9e51520dd338f3dbf49e25a3d36bc80aac68951136c4ec194c11f2343118a75684';

export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
	headers: {
		authorization: `Bearer ${API_TOKEN}`,
	},
});

export const getStrapiURL = (path = '') => {
	if (!path) {
		return '/placeholder.png';
	}
	if (path.startsWith('http') || path.startsWith('//')) {
		return path;
	}
	return `${API_URL}${path}`;
};
