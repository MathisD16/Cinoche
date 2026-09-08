import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const {user, logout} = useAuth();
    const {navigate} = useNavigate();

    const handleLogout = () =>{
        logout();
        navigate('/');
    }

    return(
        <nav className="navbar">
            <Link to="/" className="logo">Cinoche</Link>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-username">Salut, {user.username}</span>
                        <button onClick={handleLogout}>Déconnexion</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;