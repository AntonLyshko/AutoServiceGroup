import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import ServicePage from './pages/ServicePage.tsx';
import Gallery from './pages/Gallery.tsx';
import { servicesData } from './data/servicesData.ts';
import './index.css';

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
			...servicesData.map((service) => ({
				path: `services/${service.id}`,
				element: <ServicePage serviceId={service.id} />,
			})),
		],
	},
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
