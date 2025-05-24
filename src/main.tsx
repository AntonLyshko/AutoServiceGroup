import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import Home from './pages/Home';
import ServicePage from './pages/ServicePage';
import Gallery from './pages/Gallery';
import WorkExamplePage from './pages/WorkExamplePage';
import CarPage from './pages/CarPage'; // Новая страница автомобиля
import './index.css';

const queryClient = new QueryClient();

const routes = [
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: 'gallery',
				element: <Gallery />,
			},
			{
				path: 'work-examples/:workExampleId',
				element: <WorkExamplePage />,
			},
			{
				path: 'services/:serviceSlug',
				element: <ServicePage />,
			},
			{
				path: 'cars/:carId', // Новый маршрут для страницы автомобиля
				element: <CarPage />,
			},
		],
	},
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>
);
