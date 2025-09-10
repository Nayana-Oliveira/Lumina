import { searchMedia } from './services/api.js';
import { loadData, saveData } from './store/storage.js';
import {
    createItemCard,
    updateFavoriteButtonUI,
    renderResults,
    openModal,
    closeModal,
    toggleThemeUI,
    applyInitialTheme,
} from './ui/components.js';

export let state = {
    favorites: loadData('favorites', []),
    results: [],
};

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const typeSelect = document.getElementById('type-select');
export const resultsGrid = document.getElementById('results-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const themeToggle = document.getElementById('theme-toggle');
const addManualBtn = document.getElementById('add-manual-btn');
const addItemModal = document.getElementById('add-item-modal');
const closeModalBtn = document.querySelector('.close-btn');
const manualAddForm = document.getElementById('manual-add-form');

async function handleSearch() {
    const query = searchInput.value.trim();
    const type = typeSelect.value;
    if (!query) {
        alert("Por favor, digite um termo para buscar.");
        return;
    }
    resultsGrid.innerHTML = '';
    loadingIndicator.classList.remove('hidden');
    try {
        const results = await searchMedia(query, type);
        state.results = results;
        renderResults(results); 
    } catch (error) {
        resultsGrid.innerHTML = '<p>Ocorreu um erro ao buscar. Tente novamente.</p>';
        console.error(error);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * @param {string} id
 */
function toggleFavorite(id) {
    const cardElement = resultsGrid.querySelector(`.card[data-id='${id}']`);
    const itemIndex = state.favorites.findIndex(fav => fav.id === id);

    if (itemIndex > -1) {
        state.favorites.splice(itemIndex, 1);
    } else {
        const itemToAdd = state.results.find(res => res.id === id) || state.favorites.find(fav => fav.id === id);
        if (itemToAdd) {
            state.favorites.push(itemToAdd);
        }
    }
    saveData('favorites', state.favorites);

    if (cardElement) {
        updateFavoriteButtonUI(id, cardElement);
    }

    if (window.location.hash === '#/favorites') {
        renderResults(state.favorites);
    }
}

/**
 * @param {Event} event 
 */
function handleManualAdd(event) {
    event.preventDefault();
    const newItem = {
        id: `manual-${Date.now()}`,
        type: document.getElementById('manual-type').value,
        title: document.getElementById('manual-title').value,
        authors: [document.getElementById('manual-author').value],
        year: document.getElementById('manual-year').value,
        description: document.getElementById('manual-description').value,
        poster: document.getElementById('manual-poster').value || 'https://via.placeholder.com/300x450?text=Sem+Imagem',
    };
    state.results.unshift(newItem);
    renderResults(state.results);
    closeModal();
    manualAddForm.reset();
}

function handleThemeToggle() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    toggleThemeUI(isDarkMode); 
    saveData('theme', isDarkMode ? 'dark' : 'light');
}

function router() {
    const hash = window.location.hash || '#/';
    const searchSection = document.getElementById('search-section');

    searchSection.style.display = 'none';

    switch (hash) {
        case '#/':
            searchSection.style.display = 'block';
            renderResults(state.results);
            break;
        case '#/favorites':
            renderResults(state.favorites);
            break;
        case '#/collections':
            resultsGrid.innerHTML = "<h1>Página de Coleções (a implementar)</h1>";
            break;
        default:
            resultsGrid.innerHTML = "<h1>Página não encontrada</h1>";
    }
}

function init() {
    console.log("Lumina App iniciado!");

    applyInitialTheme();

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleSearch();
    });

    resultsGrid.addEventListener('click', (event) => {
        const favoriteButton = event.target.closest('.favorite-btn');
        if (favoriteButton) {
            const card = favoriteButton.closest('.card');
            toggleFavorite(card.dataset.id);
        }
    });

    addManualBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    manualAddForm.addEventListener('submit', handleManualAdd);
    themeToggle.addEventListener('click', handleThemeToggle);

    addItemModal.addEventListener('click', (event) => {
        if (event.target === addItemModal) {
            closeModal();
        }
    });

    window.addEventListener('hashchange', router);
    router(); 
}

document.addEventListener('DOMContentLoaded', init);