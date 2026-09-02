import { Link } from 'react-router-dom';

function FilmCard({ film }) {
  return (
    <Link to={`/films/${film.id}`} className="film-card">
      {film.affiche && <img src={film.affiche} alt={film.titre} />}
      <h3>{film.titre}</h3>
      <p className="note">⭐ {film.note.toFixed(1)}</p>
    </Link>
  );
}

export default FilmCard;