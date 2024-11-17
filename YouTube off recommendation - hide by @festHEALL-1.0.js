// ==UserScript==
// @name         YouTube off recommendation - hide by @festHEALL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет кнопки для скрытия/показа блоков YouTube
// @author       https://t.me/FEST_CNL
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @connect      self
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_SECONDARY = 'youtube-secondary-visibility';
    const STORAGE_KEY_MAIN = 'youtube-main-visibility';

    // Добавление CSS-стилей
    const style = document.createElement('style');
    style.textContent = `
        .custom-button {
            width: auto;
            height: 40px;
            padding: 5px 10px;
            background-color: #323232;
            color: #888888;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        }
        .custom-button.active {
            background-color: #242424;
        }
        .custom-button.video {
            width: 100%;
            height: 30px;
            display: block;
        }
    `;
    document.head.appendChild(style);

    // Функция применения стилей с !important
    function setStyleWithImportant(element, property, value) {
        if (element) {
            element.style.setProperty(property, value, 'important');
        }
    }

    // Универсальная функция переключения видимости
    function toggleVisibility(element, key, button, activeText, inactiveText) {
        const isHidden = localStorage.getItem(key) === 'hidden';
        const newState = isHidden ? 'visible' : 'hidden';
        setStyleWithImportant(element, 'visibility', newState);
        button.textContent = isHidden ? inactiveText : activeText;
        button.classList.toggle('active', !isHidden);
        localStorage.setItem(key, newState);
    }

function showFocusText(visibility) {
    const existingFocusText = document.querySelector('#focus-text');

    if (visibility === 1) {
        // Если передано 1 — скрываем элемент
        if (existingFocusText) {
            existingFocusText.style.display = 'none';
        }
    } else if (visibility === 0) {
        // Если передано 0 — показываем элемент
        if (!existingFocusText) {
            const focusText = document.createElement('div');
            focusText.id = 'focus-text'; // Добавляем id для поиска в будущем
            focusText.style.position = 'absolute'; // Относительное позиционирование
            focusText.style.top = '50%'; // Центр по вертикали
            focusText.style.left = '50%'; // Центр по горизонтали
            focusText.style.transform = 'translate(-50%, -50%)'; // Сдвигаем элемент на половину его размеров
            focusText.style.fontSize = '36px';  // Большой шрифт
            focusText.style.fontWeight = 'bold'; // Жирный шрифт
            focusText.style.textTransform = 'uppercase'; // Все буквы большие
            focusText.style.color = '#1B1B1B'; // Все буквы большие
            focusText.textContent = '☀︎тишина☀︎';
            focusText.style.zIndex = '3000'; // Обеспечивает, что текст будет поверх других элементов

            document.body.appendChild(focusText);
        } else {
            existingFocusText.style.display = 'block'; // Показываем элемент
        }
    }
}


// Функция применения сохраненного состояния видимости
function applyStoredVisibilityMainPage() {
    const toggleVisibility = (element, visibility) => {
        if (element) {
            element.style.setProperty('visibility', visibility, 'important');
        }
    };

    // Для главной страницы
    const chipsWrapper = document.querySelector('#chips-wrapper');
    const contentsBlocks = document.querySelectorAll('#primary');
    const storedStateMain = localStorage.getItem(STORAGE_KEY_MAIN);
    const shortsElements = document.querySelectorAll('.ShortsLockupViewModelHost'); // Находим все элементы с этим классом
    const isHidden = storedStateMain === 'hidden';

    if (storedStateMain === 'hidden') {
        //showFocusText(0);
        toggleVisibility(chipsWrapper, 'hidden');
        contentsBlocks.forEach(block => {
            toggleVisibility(block, 'hidden');
            // Ограничиваем высоту до 0
            setStyleWithImportant(block, 'height', '0px');
        });
    } else {
        //showFocusText(1);
        toggleVisibility(chipsWrapper, 'visible');
        contentsBlocks.forEach(block => {
            toggleVisibility(block, 'visible');
            // Убираем ограничение по высоте
            setStyleWithImportant(block, 'height', 'auto');
        });
    }

    // Переключаем видимость для элементов с классом ShortsLockupViewModelHost
    shortsElements.forEach(element => {
        setStyleWithImportant(element, 'visibility', isHidden ? 'visible' : 'hidden');
    });

}


           // Функция применения сохраненного состояния видимости
    function applyStoredVisibilityVideoPage() {
        const toggleVisibility = (element, visibility) => {
            if (element) {
                element.style.setProperty('visibility', visibility, 'important');
            }
        };

        // Для страницы видео
        const secondaryBlock = document.querySelector('ytd-watch-flexy #secondary #related');
        const storedStateSecondary = localStorage.getItem(STORAGE_KEY_SECONDARY);

        if (storedStateSecondary === 'hidden') {
            toggleVisibility(secondaryBlock, 'hidden');
        } else {
            toggleVisibility(secondaryBlock, 'visible');
        }
    }

    // Добавление кнопки для страницы видео
    function addButtonVideoPage() {
        if (document.getElementById('toggle-secondary-button')) return;

        const secondaryBlock = document.querySelector('ytd-watch-flexy #secondary');
        const innerBlock = secondaryBlock?.querySelector('#related');
        if (!secondaryBlock || !innerBlock) return;

        // Создаем кнопку
        const button = document.createElement('button');
        button.id = 'toggle-secondary-button';
        button.className = 'custom-button video';
        const storedState = localStorage.getItem(STORAGE_KEY_SECONDARY);
        button.textContent = storedState === 'hidden' ? 'тишина активна' : 'ВКЛЮЧИТЬ РЕЖИМ ТИШИНЫ';
        button.classList.toggle('active', storedState === 'hidden');

        // Обработчик нажатия
        button.addEventListener('click', () => {
            toggleVisibility(innerBlock, STORAGE_KEY_SECONDARY, button, 'тишина активна', 'ВКЛЮЧИТЬ РЕЖИМ ТИШИНЫ');
        });

        secondaryBlock.insertBefore(button, secondaryBlock.firstChild);
    }

// Добавление кнопки для главной страницы
function addButtonMainPage() {
    if (document.getElementById('toggle-main-button')) return;

    const chipsWrapper = document.querySelector('#chips-wrapper');
    const contents = document.querySelector('#primary');
    const startBlock = document.querySelector('#start');
    const shortsElements = document.querySelectorAll('.ShortsLockupViewModelHost'); // Находим все элементы с этим классом

    if (!chipsWrapper || !contents || !startBlock) return;

    // Создаем кнопку
    const button = document.createElement('button');
    button.id = 'toggle-main-button';
    button.className = 'custom-button';
    const storedState = localStorage.getItem(STORAGE_KEY_MAIN);
    button.textContent = storedState === 'hidden' ? 'тишина активна' : 'ВКЛЮЧИТЬ РЕЖИМ ТИШИНЫ';
    button.classList.toggle('active', storedState === 'hidden');

    // Обработчик нажатия
    button.addEventListener('click', () => {
        const isHidden = localStorage.getItem(STORAGE_KEY_MAIN) === 'hidden';
        const contentsBlocks = document.querySelectorAll('#primary');

        // Переключаем видимость для элементов на странице
        toggleVisibility(chipsWrapper, STORAGE_KEY_MAIN, button, 'тишина активна', 'ВКЛЮЧИТЬ РЕЖИМ ТИШИНЫ');

        // Обрабатываем высоту для элементов на странице
        contentsBlocks.forEach(block => {
            if (isHidden) {
                //showFocusText(1);
                setStyleWithImportant(block, 'visibility', 'visible');
                 // Убираем ограничение по высоте
                setStyleWithImportant(block, 'height', 'auto');
            } else {
                //showFocusText(0);
                setStyleWithImportant(block, 'visibility', 'hidden');
                // Ограничиваем высоту до 0
                setStyleWithImportant(block, 'height', '0px');
            }
        });

        // Переключаем видимость для элементов с классом ShortsLockupViewModelHost
        shortsElements.forEach(element => {
            if (isHidden) {
                setStyleWithImportant(element, 'visibility', 'visible');
                //showFocusText(1);
            } else {
                setStyleWithImportant(element, 'visibility', 'hidden');
                //showFocusText(0);
            }
        });

        //disableScroll(isHidden ? 0:1);
    });

    startBlock.appendChild(button);
}


    // Наблюдатель для динамических изменений
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const isVideoPage = document.querySelector('ytd-watch-flexy');
                if (isVideoPage) {
                    addButtonVideoPage();
                    applyStoredVisibilityVideoPage();
                } else {
                    addButtonMainPage();
                    applyStoredVisibilityMainPage();
                }
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Первоначальный вызов
    if (document.querySelector('ytd-watch-flexy')) {
        addButtonVideoPage();
        applyStoredVisibilityVideoPage();
    } else {
        addButtonMainPage();
        applyStoredVisibilityMainPage();
    }
})();
