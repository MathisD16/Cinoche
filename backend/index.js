require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Serveur Express en cours');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

/* route de test pour l'API TMDb */

const axios = require('axios');

app.get('/api/test-tmdb', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des films' });
  }
});

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

app.get('/api/films/popular', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR'
      }
    });

    const filmsSimplifies = response.data.results.map((film) => ({
      id: film.id,
      titre: film.title,
      resume: film.overview,
      affiche: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null,
      note: film.vote_average,
      dateSortie: film.release_date
    }));

    res.json(filmsSimplifies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des films' });
  }
});