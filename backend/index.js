
require('dotenv').config();

const express = require('express'); // importation librairie express
const app = express(); // on crée l'appli express 
const PORT = 3000; // le port dédié pour le localhost

const cors = require('cors');
app.use(cors());

function simplifierFilm(film) { //Fonction qui récup les infos de chaque film
  return {
    id: film.id,
    titre: film.title,
    resume: film.overview,
    // Construit l'URL complète de l'image si elle existe, sinon renvoie null
    affiche: film.poster_path ? `${TMDB_IMAGE_BASE}${film.poster_path}` : null,
    note: film.vote_average,
    dateSortie: film.release_date
  };
}

app.use(express.json());

app.get('/', (req, res) => { // Visite route     "quand tu visites localhost:3000/ => on envoie ..."  
  res.send('Serveur Express en cours'); 
});

app.listen(PORT, () => { // le serv "attend et écoute" les requetes sur le localhost 3000
  console.log(`Serveur démarré sur http://localhost:${PORT}`); // ici c'est pour juste dire que tout fonctionne 
});

/* route de test pour l'API TMDb */

const axios = require('axios'); // ajout librairie axios Simplification envoie de requete vers un serv externe ( comme l'api tmdb )

app.get('/api/test-tmdb', async (req, res) => {  // async -> indique que la fonction gère des opérations asynchrones (qui prennent du temps, comme une requête réseau)

  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', { // attend que tmdb reponde avant de continuer
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR'
      }
    });
    res.json(response.data); // envoie données brutes au client
  } catch (error) { // si tmdb répondre pas ou plante ou mauvaise clé 
    console.error(error.message); // poser une erreur avec comme message et statut ->
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

    const filmsSimplifies = response.data.results.map(simplifierFilm); // transforme le tableau résultats avec la fonction simplifierFilm

    res.json(filmsSimplifies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur récupération des films [popular]' });
  }
});

/* recherche films avec mot dans url */

app.get('/api/films/search', async (req, res) => {
  const { q } = req.query;// Récupère le texte après le "?q=" dans l'URL (ex: /api/films/search?q=batman)

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
      ...simplifierFilm(film), // reprend les infos de simplifierFilm et ajoute les deux infos suivantes
      duree: film.runtime,
      genres: film.genres.map((g) => g.name)
    };

    res.json(filmDetail);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error: 'Film introuvable' });
  }
});


const prisma = require('./prisma/client'); //ORM pour parler à la base de données facilement
const bcrypt = require('bcrypt');  // Hacher (crypter) les mdp

app.post('/api/auth/register', async(req,res) => {
  const{ email , username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username et password requis'});
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({data: {email, username, password: hashedPassword}});

    res.status(201).json({id: user.id, email: user.email, username: user.username}); // 201 = créer
  } catch (error) {
    console.error(error.message);
    res.status(400).json({error: 'Email ou username déja utilisé'});
  }

});

const jwt = require('jsonwebtoken');//Librairie pour créer des "badges d'accès" (tokens)

app.post('/api/auth/login', async(req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({error: 'Email et password sont requis'});
  }
  try {
    const user = await prisma.user.findUnique({where: {email}});

    if(!user){
      return res.status(401).json({error: 'Identifiants invalides '});
    }

    const passwordValide = await bcrypt.compare(password, user.password);

    if (!passwordValide){
      return res.status(401).json({error: 'Identifiants invalide'})
    }

    const token = jwt.sign( // créer un token qui dure 7 jours  ( badge valide si il s'est login)
      { userId: user.id},process.env.JWT_SECRET, {expiresIn: '7d'}
    );

    res.json({token, user: {id: user.id, email: user.email, username: user.username}});
  } catch(error) {
    console.error(error.message);
    res.status(500).json({error: 'Erreur lors de la connexion'});
  }
});

const verifierToken = require('./middleware/auth');

app.post('/api/entries', verifierToken, async (req, res) => {
  const { tmdbId, rating, review } = req.body;

  if (!tmdbId) {
    return res.status(400).json({ error: 'tmdbId est requis' });
  }

  try {
    const entry = await prisma.entry.create({
      data: {
        tmdbId,
        rating,
        review,
        userId: req.userId
      }
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
});

app.get('/api/entries', verifierToken, async (req, res) => {
  try {
    const entries = await prisma.entry.findMany({
      where: { userId: req.userId },
      orderBy: { watchedDate: 'desc' }
    });

    res.json(entries);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

app.put('/api/entries/:id', verifierToken, async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  try {
    const entry = await prisma.entry.findUnique({ where: { id: parseInt(id) } });

    if (!entry) {
      return res.status(404).json({ error: 'Entrée introuvable' });
    }

    if (entry.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const entryModifiee = await prisma.entry.update({
      where: { id: parseInt(id) },
      data: { rating, review }
    });

    res.json(entryModifiee);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

app.delete('/api/entries/:id', verifierToken, async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await prisma.entry.findUnique({ where: { id: parseInt(id) } });

    if (!entry) {
      return res.status(404).json({ error: 'Entrée introuvable' });
    }

    if (entry.userId !== req.userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await prisma.entry.delete({ where: { id: parseInt(id) } });

    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});


app.post('/api/watchlist', verifierToken, async(req, res)=>{
  
  const {tmdbId} =  req.body;

  if (!tmdbId) {
    return res.status(400).json({ error: 'tmdbId requis' });
  }

  try {
    const item = await prisma.watchlistItem.create({ data: {tmdbId, userId: req.userId}});

    res.status(201).json(item);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({error: 'Déjà dans la watchlist'});
    }
    console.error(error.message);
    res.status(500).json({error: "Erreur lors de l'ajout du film dans Watchlist"});
  }

});


app.get('/api/watchlist',verifierToken, async(req,res)=>{
  try{
    const items = await prisma.watchlistItem.findMany({where: {userId: req.userId}, orderBy: {addedAt: 'desc'}});
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error: 'Erreur lors de la récupération de Watchlist'});
  }
});

app.delete('/api/watchlist/:id',verifierToken, async(req,res)=>{
  const{ id } = req.params;

  try{
    const item = await prisma.watchlistItem.findUnique({where: {id: parseInt(id)}});

    if(!item) {
      return res.status(404).json({error: 'Introuvable'});
    }
    if(item.userId !== req.userId) {
      return res.status(403).json({error: 'accès refusé'});
    }

    await prisma.watchlistItem.delete({where: {id: parseInt(id)}});

    res.status(204).send();

  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Erreur lors de la suppression d 1 élément  de Watchlist' });
  }
});