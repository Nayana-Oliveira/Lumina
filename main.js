import { searchMedia } from './services/api.js';

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
    favorites: [],
    results: [],
};

const API_BASE_URL = '/api';

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

async function loadFavoritesFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/favorites`);
        if (!response.ok) {
            throw new Error('Falha ao carregar os favoritos do servidor.');
        }
        state.favorites = await response.json();
        if (window.location.hash === '#/favorites') {
            renderResults(state.favorites);
        }
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
    }
}

/**
 * @param {string} id
 */
async function toggleFavorite(id) {
    const cardElement = resultsGrid.querySelector(`.card[data-id='${id}']`);
    const isFavorite = state.favorites.some(fav => fav.id === id);
    const item = state.results.find(res => res.id === id) || state.favorites.find(fav => fav.id === id);

    if (!item) {
        console.error('Item não encontrado para favoritar.');
        return;
    }

    try {
        if (isFavorite) {
            const response = await fetch(`${API_BASE_URL}/favorites/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao remover favorito.');
            state.favorites = state.favorites.filter(fav => fav.id !== id);
        } else {
            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (!response.ok) throw new Error('Falha ao adicionar favorito.');
            state.favorites.push(item);
        }
    } catch (error) {
        console.error('Erro ao comunicar com a API de favoritos:', error);
        alert('Não foi possível atualizar o estado do favorito. Tente novamente.');
        return; 
    }


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

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

async function router() {
    const hash = window.location.hash || '#/';
    const searchSection = document.getElementById('search-section');

    resultsGrid.innerHTML = ''; 
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
    loadFavoritesFromServer();

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