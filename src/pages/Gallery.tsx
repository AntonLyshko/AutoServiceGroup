import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkExamples } from '../services/apiService';
import { TransformedWorkExamplePreview } from '../types/api';
import ImageCompare from '../components/ImageCompare';
import Loader from '../components/Loader';
import { useAuth } from '../auth/useAuth';

const Gallery = () => {
	const navigate = useNavigate();
	const { isLoggedIn } = useAuth();
	const {
		data: workExamples,
		isLoading,
		error,
	} = useQuery<TransformedWorkExamplePreview[]>({
		queryKey: ['workExamples'],
		queryFn: fetchWorkExamples,
	});

	if (isLoading && !workExamples) {
		return (
			<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen text-white flex justify-center items-center'>
				<Loader size='xl' text='Загрузка галереи работ...' />
			</div>
		);
	}

	if (error && !workExamples) {
		return (
			<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen text-red-500 flex flex-col justify-center items-center px-4 text-center'>
				<h2 className='text-2xl font-bold mb-4'>
					Ошибка загрузки галереи работ.
				</h2>
				<p className='text-gray-300 mb-6'>
					Пожалуйста, попробуйте обновить страницу или зайдите позже.
				</p>
				<button
					onClick={() => navigate('/')}
					className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors'
				>
					На главную
				</button>
			</div>
		);
	}

	return (
		<div className='pt-24 md:pt-32 bg-gray-900 min-h-screen'>
			<div className='container mx-auto px-4 py-16'>
				<button
					onClick={() => navigate('/')}
					className='mb-8 flex items-center text-gray-300 hover:text-red-500 transition-colors'
				>
					<ArrowLeft size={20} className='mr-2' />
					Назад на главную
				</button>

				<div className='relative'>
					<h1 className='text-4xl font-bold text-white mb-6'>
						Галерея наших работ
					</h1>
					{isLoggedIn && (
						<Link
							to='/admin/work-examples/new'
							className='absolute top-0 right-0 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2'
						>
							<PlusCircle size={20} />
							Создать
						</Link>
					)}
				</div>
				<p className='text-gray-300 mb-12 max-w-3xl'>
					Здесь вы можете увидеть примеры наших работ. Кликните на любую
					карточку, чтобы посмотреть все фотографии этого проекта.
				</p>

				{(!workExamples || workExamples.length === 0) && !isLoading && (
					<p className='text-center text-gray-400 py-10 text-lg'>
						Примеров работ пока нет.
					</p>
				)}

				{workExamples && workExamples.length > 0 && (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10'>
						{workExamples.map((item) => (
							<div key={item.id} className='group'>
								<Link to={`/work-examples/${item.id}`}>
									<div className='relative overflow-hidden rounded-lg h-[350px] md:h-[400px] mb-3 bg-gray-800 cursor-pointer'>
										{item.previewImage.type === 'single' ? (
											<>
												<img
													src={item.previewImage.imageUrl}
													alt={item.title}
													className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
													loading='lazy'
												/>
												<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														strokeWidth={1.5}
														stroke='white'
														className='w-12 h-12'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
														/>
													</svg>
												</div>
											</>
										) : (
											<ImageCompare
												beforeImage={item.previewImage.beforeImage}
												afterImage={item.previewImage.afterImage}
												altBefore={`До - ${item.title}`}
												altAfter={`После - ${item.title}`}
											/>
										)}
									</div>
								</Link>
								<div>
									<h4 className='text-lg font-semibold text-white mb-1'>
										<Link
											to={`/work-examples/${item.id}`}
											className='hover:text-red-500'
										>
											{item.title}
										</Link>
										{item.previewImage.type === 'beforeAfter' && (
											<span className='text-sm text-gray-400 ml-2'>
												(До/После)
											</span>
										)}
									</h4>
									<p className='text-gray-300 text-sm'>
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Gallery;
