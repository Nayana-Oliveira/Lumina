const express = require('express');
const axios = require('axios');
const router = express.Router();
const Item = require('../models/item'); 

function normalizeData(item, type) {
    if (type === 'book') {
        const volumeInfo = item.volumeInfo || {};
        return {
            id: item.id,
            type: 'book',
            title: volumeInfo.title || 'Título desconhecido',
            authors: volumeInfo.authors || ['Autor desconhecido'],
            year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear().toString() : 'N/A',
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
            poster: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/150',
        };
    }
    return null;
}

router.get('/search', async (req, res) => {
    const { query, type } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'O parâmetro de busca (query) é obrigatório.' });
    }

    let results = [];

    try {
        if (type === 'all' || type === 'book') {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
            const books = response.data.items ? response.data.items.map(item => normalizeData(item, 'book')) : [];
            results = results.concat(books);
        }
        if (type === 'all' || type === 'movie') {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
            if (response.data.Response === "True") {
                const movies = response.data.Search.map(item => normalizeData(item, 'movie'));
                results = results.concat(movies);
            }
        }
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar na API externa:', error);
        res.status(500).json({ message: 'Erro interno ao realizar a busca.' });
    }
});

router.get('/favorites', async (req, res) => {
    try {
        const favorites = await Item.find();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar favoritos.', error });
    }
});

router.post('/favorites', async (req, res) => {
    const favoriteItem = new Item({
        id: req.body.id,
        type: req.body.type,
        title: req.body.title,
        authors: req.body.authors,
        year: req.body.year,
        description: req.body.description,
        poster: req.body.poster,
    });

    try {
        const existingItem = await Item.findOne({ id: req.body.id });
        if (existingItem) {
            return res.status(409).json({ message: 'Item já existe nos favoritos.' });
        }
        
        const newItem = await favoriteItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao salvar favorito.', error });
    }
});

router.delete('/favorites/:id', async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ id: req.params.id });
        if (!item) {
            return res.status(404).json({ message: 'Favorito não encontrado.' });
        }
        res.json({ message: 'Favorito removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover favorito.', error });
    }
});

module.exports = router;