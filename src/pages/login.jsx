import "./login.css";
import { Link, useNavigate } from "react-router-dom"; // 🔹 Importer useNavigate
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 🔹 Pour rediriger

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Appel API backend Laravel
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      console.log("Réponse backend :", response.data);

      // 🔹 Stocker le token dans le localStorage
      localStorage.setItem("token", response.data.access_token);
      // login.jsx
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 🔹 Redirection vers l’accueil après succès
      navigate("/Accueil");  // ⚠️ Mets le même chemin que ta route React
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      {/* Logo + Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-[30px] h-[30px]">
          <div className="absolute top-[2.67px] left-[2.67px] w-[26.66px] h-[26.66px] bg-white"></div>
          <div className="absolute top-[2.67px] left-[2.67px] w-[20px] h-[13.33px] bg-white"></div>
          <div className="absolute top-[2.67px] left-[2.67px] w-[13.33px] h-[26.66px] bg-white"></div>
        </div>
        <div className="login-title"> <img 
    src="/src/assets/logo.png" 
    alt="logo" 
    className="w-6 h-6"  
  />RED PRODUCT</div>
      </div>

      <div className="login-container">
        <h2 style={{ textAlign: "center", color: "#4B5563", marginBottom: "2rem" }}>
          Connectez-vous en tant que Admin
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "2.5rem" }}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
            <input type="checkbox" id="remember" style={{ marginRight: "0.5rem" }} />
            <label htmlFor="remember" style={{ color: "#4B5563", fontSize: "0.875rem" }}>
              Gardez-moi connecté
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#1F2937",
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link to="/reset" style={{ color: "#FACC15", textDecoration: "underline" }}>
          Mot de passe oublié ?
        </Link>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "white" }}>
          Vous n’avez pas de compte ?{" "}
          <Link to="/inscription" style={{ color: "#FACC15", textDecoration: "underline" }}>
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
