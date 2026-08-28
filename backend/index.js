require('dotenv').config();

const express = require('express'); // importation librairie express
const app = express(); // on crée l'appli express 
const PORT = 3000; // le port dédié pour le localhost

function simplifierFilm(film) {
  return {
    id: film.id,
    titre: film.title,
    resume: film.overview,
    affiche: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null,
    note: film.vote_average,
    dateSortie: film.release_date
  };
}

app.get('/', (req, res) => { // Visite route     "quand tu visites localhost:3000/ => on envoie ..."  
  res.send('Serveur Express en cours'); 
});

app.listen(PORT, () => { // le serv "attend et écoute" les requetes sur le localhost 3000
  console.log(`Serveur démarré sur http://localhost:${PORT}`); // ici c'est pour juste dire que tout fonctionne 
});

/* route de test pour l'API TMDb */

const axios = require('axios'); // ajout librairie axios Simplification envoie de requete vers un serv externe ( comme l'api tmdb )

app.get('/api/test-tmdb', async (req, res) => { 
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', { // r
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur récupération des films [test tout film]' });
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

    const filmsSimplifies = response.data.results.map(simplifierFilm);

    res.json(filmsSimplifies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur récupération des films [popular]' });
  }
});

/* recherche films avec mot dans url */

app.get('/api/films/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Le paramètre "q" est requis' });
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR',
        query: q
      }
    });

    const filmsSimplifies = response.data.results.map(simplifierFilm);

    res.json(filmsSimplifies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// route identifiant précis (quand on aura choisi notre film précis par exemple)

app.get('/api/films/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR'
      }
    });

    const film = response.data;

    const filmDetail = {
      ...simplifierFilm(film),
      duree: film.runtime,
      genres: film.genres.map((g) => g.name)
    };

    res.json(filmDetail);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: 'Film introuvable' });
  }
});