import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error);
        return;
      }

      navigate('/login');
    } catch (error) {
      setErreur('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="auth-form">
      <h1>Inscription</h1>
      {erreur && <p className="erreur">{erreur}</p>}
        <form onSubmit={handleSubmit} class="form">
          <span class="input-span">
            <label for="username" class="label">Nom d'utilisateur</label>
            <input type="username" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required
          /></span>
          <span class="input-span">
            <label for="email" class="label">Email</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
          /></span>
          <span class="input-span">
            <label for="password" class="label">Mot de passe</label>
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required
          /></span>
          <span class="span"><a href="#">Mot de passe oublié ?</a></span>
          <input class="submit" type="submit" value="Se connecter" />
          <span class="span">Déjà un compte ? <Link to="/login">Se connecter</Link></span>
        </form>

    </div>
  );
}

export default Register;