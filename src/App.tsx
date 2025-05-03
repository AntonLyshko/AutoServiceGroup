import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
	return (
		<div className='min-h-screen bg-gray-900 text-white flex flex-col'>
			<Navbar />
			<ScrollRestoration />
			<main className='flex-grow'>
				{' '}
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

export default App;
