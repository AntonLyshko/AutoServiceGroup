import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminLayout: React.FC = () => {
	return (
		<div className='min-h-screen bg-gray-900 text-white flex flex-col'>
			<AdminHeader />
			<main className='flex-grow container mx-auto px-4 py-8'>
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
