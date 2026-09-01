import { useState, useEffect } from 'react';
import FilmCard from './components/FilmCard';

function App() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/films/popular')
      .then((res) => res.json())
      .then((data) => setFilms(data));
  }, []);

  return (
    <div>
      <h1>Films populaires</h1>
      <div className="films-grid">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </div>
  );
}

export default App;