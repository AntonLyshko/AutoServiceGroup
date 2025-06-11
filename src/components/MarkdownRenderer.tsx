import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
	content,
	className = '',
}) => {
	return (
		<div
			className={`prose prose-invert max-w-none text-gray-300 ${className}`}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// Кастомизация рендеринга тегов при необходимости
					h1: ({ node, ...props }) => (
						<h1 className='text-white' {...props} />
					),
					h2: ({ node, ...props }) => (
						<h2 className='text-white' {...props} />
					),
					h3: ({ node, ...props }) => (
						<h3 className='text-white' {...props} />
					),
					a: ({ node, ...props }) => (
						<a className='text-red-500 hover:text-red-400' {...props} />
					),
					ul: ({ node, ...props }) => (
						<ul className='list-disc list-inside' {...props} />
					),
					ol: ({ node, ...props }) => (
						<ol className='list-decimal list-inside' {...props} />
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
