import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error);
        return;
      }

      login(data.token, data.user);
      navigate('/');
    } catch (error) {
      setErreur('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="auth-form">
      <h1>Connexion</h1>
      {erreur && <p className="erreur">{erreur}</p>}
        <form onSubmit={handleSubmit} class="form">
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
          <span class="span">Pas encore de compte ? <Link to="/register">S'inscrire</Link></span>
        </form>
    </div>
  );
}

export default Login;