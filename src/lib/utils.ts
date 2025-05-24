// src/lib/utils.ts

/**
 * Форматирует номер телефона для отображения.
 * Пример: +7 (965) 511-85-85
 * @param phone - Номер телефона в строковом формате.
 * @returns Отформатированный номер телефона или исходная строка, если форматирование невозможно.
 */
export const formatDisplayPhoneNumber = (
	phone: string | undefined | null
): string => {
	if (!phone) return '';

	// Удаляем все нецифровые символы, кроме начального '+'
	let cleaned = phone.replace(/[^\d+]/g, '');

	// Если номер начинается с '8' и имеет 11 цифр (российский формат без +), заменяем '8' на '+7'
	if (cleaned.startsWith('8') && cleaned.length === 11) {
		cleaned = '+7' + cleaned.substring(1);
	}
	// Если номер начинается с '7' (без +) и имеет 11 цифр, добавляем '+'
	else if (
		cleaned.startsWith('7') &&
		cleaned.length === 11 &&
		!cleaned.startsWith('+')
	) {
		cleaned = '+' + cleaned;
	}
	// Если номер состоит из 10 цифр (без кода страны), предполагаем, что это российский номер и добавляем '+7'
	else if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
		cleaned = '+7' + cleaned;
	}

	// Применяем маску +X (XXX) XXX-XX-XX или +XX (XXX) XXX-XX-XX и т.д.
	const match = cleaned.match(/^(\+\d{1,3})(\d{3})(\d{3})(\d{2})(\d{2})$/);

	if (match) {
		return `${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
	}

	// Если не подошло под основную маску, возвращаем "очищенный" или исходный номер
	return cleaned || phone;
};

/**
 * Форматирует номер телефона для использования в ссылке tel:
 * Пример: +79655118585
 * @param phone - Номер телефона в строковом формате.
 * @returns Номер телефона, пригодный для tel: ссылок.
 */
export const formatPhoneNumberForTelLink = (
	phone: string | undefined | null
): string => {
	if (!phone) return '';
	let cleaned = phone.replace(/[^\d+]/g, ''); // Оставляем только цифры и +

	// Если номер начинается с '8' и имеет 11 цифр, заменяем '8' на '+7'
	if (cleaned.startsWith('8') && cleaned.length === 11) {
		cleaned = '+7' + cleaned.substring(1);
	}
	// Если номер начинается с '7' (без +) и имеет 11 цифр, добавляем '+'
	else if (
		cleaned.startsWith('7') &&
		cleaned.length === 11 &&
		!cleaned.startsWith('+')
	) {
		cleaned = '+' + cleaned;
	}
	// Если номер состоит из 10 цифр (без кода страны), предполагаем, что это российский номер и добавляем '+7'
	else if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
		cleaned = '+7' + cleaned;
	}
	// Убедимся что номер начинается с + если это не так и он достаточно длинный
	else if (!cleaned.startsWith('+') && cleaned.length >= 10) {
		cleaned = '+' + cleaned;
	}
	return cleaned;
};
