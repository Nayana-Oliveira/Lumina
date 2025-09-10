import { normalizeData } from '../utils/helpers.js';

const OMDb_API_KEY = '85ad17e0'; 
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const OMDb_API_URL = `https://www.omdbapi.com/?apikey=${OMDb_API_KEY}`;

async function searchBooks(query) {
    try {
        const response = await fetch(`${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Erro ao buscar livros.');
        const data = await response.json();
        return data.items ? data.items.map(item => normalizeData(item, 'book')) : [];
    } catch (error) {
        console.error('Erro na API Google Books:', error);
        return [];
    }
}

async function searchMovies(query) {
    try {
        const response = await fetch(`${OMDb_API_URL}&s=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Erro ao buscar filmes.');
        const data = await response.json();
        if (data.Response === "True") {
            return data.Search.map(item => normalizeData(item, 'movie'));
        }
        return [];
    } catch (error) {
        console.error('Erro na API OMDb:', error);
        return [];
    }
}

export async function searchMedia(query, type = 'all') {
    let results = [];
    if (type === 'all' || type === 'book') {
        const books = await searchBooks(query);
        results = results.concat(books);
    }
    if (type === 'all' || type === 'movie') {
        const movies = await searchMovies(query);
        results = results.concat(movies);
    }
    return results;
}