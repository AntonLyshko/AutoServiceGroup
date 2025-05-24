import React from 'react';
import { StrapiRichTextBlock } from '../types/api'; // Убедитесь, что этот тип импортируется или определен здесь

interface StrapiRichTextRendererProps {
	content: StrapiRichTextBlock[] | null | undefined;
	// Можно добавить пропсы для кастомизации рендеринга определенных типов
	// например, customParagraph?: (children: React.ReactNode, key: string) => React.ReactElement;
}

const renderTextNode = (node: any, index: number): React.ReactNode => {
	let children = <>{node.text}</>;
	if (node.bold) {
		children = <strong key={`bold-${index}`}>{children}</strong>;
	}
	if (node.italic) {
		children = <em key={`italic-${index}`}>{children}</em>;
	}
	if (node.underline) {
		children = <u key={`underline-${index}`}>{children}</u>;
	}
	if (node.strikethrough) {
		children = <s key={`strike-${index}`}>{children}</s>;
	}
	if (node.code) {
		children = <code key={`code-${index}`}>{children}</code>;
	}
	return children;
};

const StrapiRichTextRenderer: React.FC<StrapiRichTextRendererProps> = ({
	content,
}) => {
	if (!content || !Array.isArray(content)) {
		return null;
	}

	return (
		<>
			{content.map((block, index) => {
				const blockKey = `block-${index}`;
				switch (block.type) {
					case 'paragraph':
						return (
							<p key={blockKey}>
								{block.children.map((child, childIndex) => (
									<React.Fragment key={childIndex}>
										{renderTextNode(child, childIndex)}
									</React.Fragment>
								))}
							</p>
						);
					case 'list':
						const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
						return (
							<ListTag key={blockKey}>
								{block.children.map((listItem, listItemIndex) => (
									<li key={`${blockKey}-li-${listItemIndex}`}>
										{listItem.children.map(
											(child: any, childIndex: number) => (
												<React.Fragment key={childIndex}>
													{renderTextNode(child, childIndex)}
												</React.Fragment>
											)
										)}
									</li>
								))}
							</ListTag>
						);
					case 'heading':
						const HeadingTag = `h${
							block.level || 1
						}` as keyof JSX.IntrinsicElements;
						return (
							<HeadingTag key={blockKey}>
								{block.children.map((child, childIndex) => (
									<React.Fragment key={childIndex}>
										{renderTextNode(child, childIndex)}
									</React.Fragment>
								))}
							</HeadingTag>
						);
					// Добавьте обработку других типов блоков здесь (image, quote, code-block, link и т.д.)
					// case 'image':
					//   // block.image.url, block.image.alternativeText
					//   return <img key={blockKey} src={getStrapiURL(block.image.url)} alt={block.image.alternativeText || ''} />;
					default:
						// Для неизвестных блоков можно выводить их JSON или ничего
						// console.warn('Unknown Strapi Rich Text block type:', block.type, block);
						return null;
				}
			})}
		</>
	);
};

export default StrapiRichTextRenderer;
