// --- Остальной код galleryItemsData остается без изменений ---
export interface GalleryItemBase {
	id: number | string;
	title: string;
	description: string;
}

export interface GallerySingleItem extends GalleryItemBase {
	type: 'single';
	imageUrl: string;
}

export interface GalleryBeforeAfterItem extends GalleryItemBase {
	type: 'beforeAfter';
	beforeImage: string;
	afterImage: string;
}

export type GalleryItem = GallerySingleItem | GalleryBeforeAfterItem;

export const galleryItemsData: GalleryItem[] = [
	{
		id: 1,
		type: 'single',
		imageUrl:
			'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg',
		title: 'Ремонт двигателя',
		description: 'Капитальный ремонт двигателя Toyota',
	},
	{
		id: 'ba1',
		type: 'beforeAfter',
		title: 'Восстановление кузова',
		description: 'Полное восстановление после ДТП',
		beforeImage:
			'https://images.pexels.com/photos/9626967/pexels-photo-9626967.jpeg',
		afterImage:
			'https://images.pexels.com/photos/3778769/pexels-photo-3778769.jpeg',
	},
	{
		id: 2,
		type: 'single',
		imageUrl:
			'https://images.pexels.com/photos/244553/pexels-photo-244553.jpeg',
		title: 'Покраска автомобиля',
		description: 'Полная покраска Mercedes-Benz',
	},
	{
		id: 'ba2',
		type: 'beforeAfter',
		title: 'Полировка кузова',
		description: 'Устранение царапин и придание блеска',
		beforeImage:
			'https://images.pexels.com/photos/9800012/pexels-photo-9800012.jpeg',
		afterImage:
			'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
	},
	{
		id: 3,
		type: 'single',
		imageUrl:
			'https://images.pexels.com/photos/3807500/pexels-photo-3807500.jpeg',
		title: 'Ремонт подвески',
		description: 'Замена амортизаторов и пружин',
	},
	{
		id: 4,
		type: 'single',
		imageUrl:
			'https://images.pexels.com/photos/9607184/pexels-photo-9607184.jpeg',
		title: 'Детейлинг салона',
		description: 'Химчистка и восстановление пластика',
	},
	{
		id: 5,
		type: 'single',
		imageUrl:
			'https://images.pexels.com/photos/4489731/pexels-photo-4489731.jpeg',
		title: 'Сварочные работы',
		description: 'Восстановление порогов и днища',
	},
	{
		id: 6,
		type: 'single',
		imageUrl:
			'https://images.pexels.com/photos/13009432/pexels-photo-13009432.jpeg',
		title: 'Диагностика',
		description: 'Компьютерная диагностика систем',
	},
];
