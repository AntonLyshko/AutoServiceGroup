import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageCompareProps {
	beforeImage: string;
	afterImage: string;
	altBefore?: string;
	altAfter?: string;
}

const ImageCompare: React.FC<ImageCompareProps> = ({
	beforeImage,
	afterImage,
	altBefore = 'Before',
	altAfter = 'After',
}) => {
	const [sliderPosition, setSliderPosition] = useState<number>(50); // Позиция слайдера в %
	const [isDragging, setIsDragging] = useState<boolean>(false); // Только для тач
	const containerRef = useRef<HTMLDivElement>(null);
	const handleRef = useRef<HTMLDivElement>(null);
	// Убрали beforeImageRef, так как clip-path применяется прямо к img

	const updateSliderPosition = useCallback((clientX: number) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		let x = clientX - rect.left;
		x = Math.max(0, Math.min(x, rect.width));
		const percent = (x / rect.width) * 100;
		setSliderPosition(percent);
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			updateSliderPosition(e.clientX);
		},
		[updateSliderPosition]
	);

	const handleTouchStart = useCallback(
		(e: React.TouchEvent<HTMLDivElement>) => {
			if (
				e.target === handleRef.current ||
				handleRef.current?.contains(e.target as Node)
			) {
				setIsDragging(true);
				if (e.touches.length > 0) {
					updateSliderPosition(e.touches[0].clientX);
				}
			}
		},
		[updateSliderPosition]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!isDragging) return;
			if (e.touches.length > 0) {
				updateSliderPosition(e.touches[0].clientX);
			}
		},
		[isDragging, updateSliderPosition]
	);

	const handleTouchEnd = useCallback(() => {
		if (isDragging) {
			setIsDragging(false);
		}
	}, [isDragging]);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('touchmove', handleTouchMove, {
				passive: false,
			});
			document.addEventListener('touchend', handleTouchEnd);
			document.addEventListener('touchcancel', handleTouchEnd);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
			document.removeEventListener('touchcancel', handleTouchEnd);
			document.body.style.overflow = '';
		};
	}, [isDragging, handleTouchMove, handleTouchEnd]);

	return (
		<div
			ref={containerRef}
			className='relative w-full h-full overflow-hidden select-none'
			onMouseMove={handleMouseMove}
			onTouchStart={handleTouchStart}
		>
			{/* After Image (Базовый слой) */}
			<img
				src={afterImage}
				alt={altAfter}
				className='absolute top-0 left-0 w-full h-full object-cover pointer-events-none'
				loading='lazy'
			/>

			{/* Before Image (Слой с маской) */}
			{/* Теперь clip-path применяется прямо к изображению */}
			<img
				src={beforeImage}
				alt={altBefore}
				className='absolute top-0 left-0 w-full h-full object-cover pointer-events-none'
				style={{
					// clipPath: `inset(0px ${100 - sliderPosition}% 0px 0px)`, // Стандартный синтаксис
					clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`, // Через полигон, более надежно
				}}
				loading='lazy'
			/>

			{/* Slider Handle */}
			<div
				ref={handleRef}
				className='absolute top-0 bottom-0 w-1 bg-red-600 z-10 pointer-events-none md:pointer-events-auto'
				style={{
					left: `calc(${sliderPosition}% - 0.5px)`,
					touchAction: 'none',
				}}
			>
				{/* Визуальный элемент ползунка */}
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-md'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={2}
						stroke='white'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default ImageCompare;
