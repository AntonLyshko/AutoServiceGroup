import React from 'react';

interface LoaderProps {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	text?: string;
	className?: string; // For the container div
	spinnerClassName?: string; // For the spinner div itself
	textColor?: string; // For the text color
}

const Loader: React.FC<LoaderProps> = ({
	size = 'md',
	text,
	className = '',
	spinnerClassName = '',
	textColor = 'text-gray-300',
}) => {
	let sizeClasses = '';
	let textSizeClass = 'text-sm';

	switch (size) {
		case 'xs':
			sizeClasses = 'w-4 h-4 border-2';
			textSizeClass = 'text-xs';
			break;
		case 'sm':
			sizeClasses = 'w-6 h-6 border-2';
			textSizeClass = 'text-sm';
			break;
		case 'md':
			sizeClasses = 'w-10 h-10 border-4';
			textSizeClass = 'text-base';
			break;
		case 'lg':
			sizeClasses = 'w-16 h-16 border-4';
			textSizeClass = 'text-lg';
			break;
		case 'xl':
			sizeClasses = 'w-24 h-24 border-4';
			textSizeClass = 'text-xl';
			break;
		default:
			sizeClasses = 'w-10 h-10 border-4';
			textSizeClass = 'text-base';
	}

	return (
		<div
			className={`flex flex-col items-center justify-center ${className}`}
		>
			<div
				className={`animate-spin rounded-full border-solid border-red-500 border-t-transparent ${sizeClasses} ${spinnerClassName}`}
				role='status' // For accessibility
				aria-live='polite'
				aria-label={text ? undefined : 'Загрузка'}
			>
				<span className='sr-only'>Загрузка...</span>{' '}
				{/* For screen readers */}
			</div>
			{text && (
				<p className={`mt-2 ${textSizeClass} ${textColor}`}>{text}</p>
			)}
		</div>
	);
};

export default Loader;
