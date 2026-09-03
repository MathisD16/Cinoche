import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function FilmDetail() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/films/${id}`)
      .then((res) => res.json())
      .then((data) => setFilm(data));
  }, [id]);

  if (!film) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="film-detail">
      <Link to="/" className="back-link">← Retour</Link>
      <div className="film-detail-content">
        {film.affiche && <img src={film.affiche} alt={film.titre} />}
        <div>
          <h1>{film.titre}</h1>
          <p className="note">⭐ {film.note.toFixed(1)} · {film.duree} min</p>
          <p className="genres">{film.genres.join(', ')}</p>
          <p className="resume">{film.resume}</p>
          <div className="actions">
            <button>+ Ajouter à la watchlist</button>
            <button>Marquer comme vu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmDetail;