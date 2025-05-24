// src/lib/ymaps.ts
import React from 'react';
import ReactDOM from 'react-dom'; // Используем ReactDOM для bindTo

// Глобальная переменная ymaps3 должна быть доступна после подключения скрипта в index.html
// @ts-ignore ymaps3 это глобальная переменная из скрипта Яндекс.Карт
const ymaps3 = window.ymaps3;

// Ожидаем загрузки API и модуля reactify
// Используем Promise.all для параллельной загрузки
const [ymaps3React] = await Promise.all([
	ymaps3.import('@yandex/ymaps3-reactify'), // Импортируем reactify модуль
	ymaps3.ready, // Дожидаемся полной готовности API
]);

// Создаем reactify инстанс, привязанный к вашим React и ReactDOM
// bindTo(React, ReactDOM) - это важно!
const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

// Экспортируем необходимые React-компоненты карты
// module(ymaps3) преобразует нативные классы ymaps3 в React-компоненты
export const {
	YMap,
	YMapDefaultSchemeLayer,
	YMapDefaultFeaturesLayer,
	YMapMarker,
	YMapControls, // Если нужны стандартные контролы
	YMapZoomControl, // Пример контрола зума
	YMapGeolocationControl, // Пример контрола геолокации
	// Добавьте другие компоненты, которые вам нужны, например, YMapListener, YMapFeature, etc.
} = reactify.module(ymaps3);

// Также экспортируем сам reactify, если он понадобится для useDefault и т.д.
export { reactify };

// Вы можете также экспортировать типы, если они нужны в других местах
// import type { YMapLocationRequest } from 'ymaps3';
// export type { YMapLocationRequest };
