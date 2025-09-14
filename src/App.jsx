import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inscription from "./pages/inscription";
import Reset from "./pages/Reset";
import Accueil from "./pages/accueil";
import Ajout from "./pages/HotelForm";
import ResetPassword from "./pages/ResetPassword";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page login */}
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/Ajout" element={<Ajout />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Exemple : page d'accueil */}
        <Route path="/" element={<h1 className="text-3xl text-center mt-10">Bienvenue 🚀</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
