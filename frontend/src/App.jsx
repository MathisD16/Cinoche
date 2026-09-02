import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FilmDetail from './pages/FilmDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/films/:id" element={<FilmDetail />} /> 
    </Routes>
  );
}

export default App;