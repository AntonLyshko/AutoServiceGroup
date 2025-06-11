import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/useAuth';

// Public Pages & Components
import App from './App';
import Home from './pages/Home';
import ServicePage from './pages/ServicePage';
import Gallery from './pages/Gallery';
import WorkExamplePage from './pages/WorkExamplePage';
import CarPage from './pages/CarPage';

// Admin Pages & Components
import ProtectedRoute from './pages/admin/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import SettingsEditPage from './pages/admin/SettingsEditPage';
// List Pages
import CarListPage from './pages/admin/CarListPage';
import ServiceListPage from './pages/admin/ServiceListPage';
import WorkExampleListPage from './pages/admin/WorkExampleListPage';
// Create Pages
import CarCreatePage from './pages/admin/CarCreatePage';
import ServiceCreatePage from './pages/admin/ServiceCreatePage';
import WorkExampleCreatePage from './pages/admin/WorkExampleCreatePage';
// Edit Pages
import CarEditPage from './pages/admin/CarEditPage';
import ServiceEditPage from './pages/admin/ServiceEditPage';
import WorkExampleEditPage from './pages/admin/WorkExampleEditPage';

import './index.css';

const queryClient = new QueryClient();

const router = createBrowserRouter([
	// Public Routes
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'gallery', element: <Gallery /> },
			{
				path: 'work-examples/:workExampleId',
				element: <WorkExamplePage />,
			},
			{ path: 'services/:serviceId', element: <ServicePage /> },
			{ path: 'cars/:carId', element: <CarPage /> },
		],
	},
	// Admin Routes
	{
		path: '/admin',
		element: (
			<ProtectedRoute>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{ path: 'settings', element: <SettingsEditPage /> },
			// Car routes
			{ path: 'cars', element: <CarListPage /> },
			{ path: 'cars/new', element: <CarCreatePage /> },
			{ path: 'cars/:carId/edit', element: <CarEditPage /> },
			// Service routes
			{ path: 'services', element: <ServiceListPage /> },
			{ path: 'services/new', element: <ServiceCreatePage /> },
			{ path: 'services/:serviceId/edit', element: <ServiceEditPage /> },
			// Work Example routes
			{ path: 'work-examples', element: <WorkExampleListPage /> },
			{ path: 'work-examples/new', element: <WorkExampleCreatePage /> },
			{
				path: 'work-examples/:workExampleId/edit',
				element: <WorkExampleEditPage />,
			},
		],
	},
	{
		path: '/admin/login',
		element: <LoginPage />,
	},
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>
);
