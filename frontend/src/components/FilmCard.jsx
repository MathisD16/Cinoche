function FilmCard({ film }) {
    return (
        <div className="film-card">
            {film.affiche && <img src={film.affiche} alt={film.titre} />}
            <h3>{film.titre}</h3>
            <p className="note">* {film.note.toFixed(1)}</p>
        </div> 
    );
}

export default FilmCard;

