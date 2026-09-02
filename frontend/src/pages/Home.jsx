import { useState, useEffect } from 'react';
import FilmCard from '../components/FilmCard';

function Home() {
  const [films, setFilms] = useState([]);
  const [query, setQuery] = useState('');

  const chargerFilmsPopulaires = () => {
    fetch('http://localhost:3000/api/films/popular')
      .then((res) => res.json())
      .then((data) => setFilms(data));
  };

  const rechercherFilms = (q) => {
    fetch(`http://localhost:3000/api/films/search?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setFilms(data));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() === '') {
        chargerFilmsPopulaires();
      } else {
        rechercherFilms(query);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <h1>Films</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un film..."
      />
      <div className="films-grid">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}

export default Home;