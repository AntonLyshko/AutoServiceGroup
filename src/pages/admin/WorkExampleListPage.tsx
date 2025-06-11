import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkExamples } from '../../services/apiService';
import { TransformedWorkExamplePreview } from '../../types/api';
import Loader from '../../components/Loader';
import { PlusCircle, Edit } from 'lucide-react';

const WorkExampleListPage: React.FC = () => {
	const {
		data: workExamples,
		isLoading,
		error,
	} = useQuery<TransformedWorkExamplePreview[]>({
		queryKey: ['workExamples'],
		queryFn: fetchWorkExamples,
	});

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader size='lg' text='Загрузка примеров работ...' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center text-red-500'>
				Ошибка загрузки примеров работ.
			</div>
		);
	}

	return (
		<div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Управление примерами работ</h1>
				<Link
					to='/admin/work-examples/new'
					className='flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors'
				>
					<PlusCircle size={20} className='mr-2' />
					Создать
				</Link>
			</div>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-gray-900 rounded-md'>
					<thead>
						<tr className='border-b border-gray-700'>
							<th className='text-left p-4'>Название</th>
							<th className='text-right p-4'>Действия</th>
						</tr>
					</thead>
					<tbody>
						{workExamples && workExamples.length > 0 ? (
							workExamples.map((item) => (
								<tr
									key={item.id}
									className='border-b border-gray-700 hover:bg-gray-800'
								>
									<td className='p-4'>{item.title}</td>
									<td className='p-4 text-right'>
										<Link
											to={`/admin/work-examples/${item.id}/edit`}
											className='inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition-colors text-sm'
										>
											<Edit size={16} className='mr-1.5' />
											Редактировать
										</Link>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={2} className='text-center p-6 text-gray-400'>
									Примеры работ еще не добавлены.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default WorkExampleListPage;
