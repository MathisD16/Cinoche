import { useState, useEffect } from 'react';
import FilmCard from './components/FilmCard';

function App() {
  const [films, setFilms] = useState([]);
  const [query, setQuery] = useState('');

  const chargerFilmsPopulaires = () => {
    fetch('http://localhost:3000/api/films/popular').then((res)=> res.json()).then((data)=>setFilms(data));
  }

  const rechercherFilms = (q) => {
    fetch(`http://localhost:3000/api/films/search?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setFilms(data));
  };


  useEffect(() => {
    chargerFilmsPopulaires();
  }, []);

const handleSubmit = (e) => {
  e.preventDefault();

  if(query.trim() === ''){
    chargerFilmsPopulaires();
  } else {
    rechercherFilms(query);
  }
};

  return (
    <div>
      <h1>Films populaires</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Rechercher un film ... "/>
        <button type="submit">Rechercher</button>
      </form>

      <div className="films-grid">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}

export default App;