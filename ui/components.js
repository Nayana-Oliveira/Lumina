import { state, resultsGrid } from '../main.js';
import { loadData } from '../store/storage.js';

/**
 * @param {object} item 
 * @returns {string} 
 */
export function createItemCard(item) {
    const isFavorite = state.favorites.some(fav => fav.id === item.id);
    
    return `
        <div class="card" data-id="${item.id}">
            <img src="${item.poster}" alt="Pôster de ${item.title}">
            <button class="favorite-btn" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
            <div class="card-content">
                <span class="card-type">${item.type === 'book' ? 'Livro' : 'Filme'}</span>
                <h3>${item.title}</h3>
                <p><strong>${item.type === 'book' ? 'Autor' : 'Diretor'}:</strong> ${item.authors.join(', ')}</p>
                <p><strong>Ano:</strong> ${item.year}</p>
            </div>
        </div>
    `;
}

/**
 * @param {string} id 
 * @param {HTMLElement} cardElement 
 */
export function updateFavoriteButtonUI(id, cardElement) {
    const isFavorite = state.favorites.some(fav => fav.id === id);
    const svg = cardElement.querySelector('.favorite-btn svg');
    const button = cardElement.querySelector('.favorite-btn');

    if (svg && button) {
        svg.setAttribute('fill', isFavorite ? 'var(--accent-color)' : 'none');
        button.setAttribute('aria-label', isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    }
}

/**
 * @param {Array} items 
 */
export function renderResults(items) {
    if (!items || items.length === 0) {
        resultsGrid.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum item para exibir.</p>';
        return;
    }
    resultsGrid.innerHTML = items.map(createItemCard).join('');
}

export function openModal() {
    const addItemModal = document.getElementById('add-item-modal');
    if (addItemModal) {
        addItemModal.classList.remove('hidden');
    }
}

export function closeModal() {
    const addItemModal = document.getElementById('add-item-modal');
    if (addItemModal) {
        addItemModal.classList.add('hidden');
    }
}

/**
 * @param {boolean} isDarkMode 
 */
export function toggleThemeUI(isDarkMode) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

export function applyInitialTheme() {
    const savedTheme = loadData('theme', 'light');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleThemeUI(true);
    } else {
        toggleThemeUI(false);
    }
}