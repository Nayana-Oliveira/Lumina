export function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export function normalizeData(item, type) {
    if (type === 'book') {
        const volumeInfo = item.volumeInfo || {};
        return {
            id: item.id,
            type: 'book',
            title: volumeInfo.title || 'Título desconhecido',
            authors: volumeInfo.authors || ['Autor desconhecido'],
            year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : 'N/A',
            description: volumeInfo.description || 'Sem descrição.',
            poster: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
        };
    }

    if (type === 'movie') {
        return {
            id: item.imdbID,
            type: 'movie',
            title: item.Title || 'Título desconhecido',
            authors: item.Director !== 'N/A' ? [item.Director] : ['Diretor desconhecido'],
            year: item.Year || 'N/A',
            description: item.Plot || 'Sem sinopse.',
            poster: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/150',
        };
    }

    return null;
}