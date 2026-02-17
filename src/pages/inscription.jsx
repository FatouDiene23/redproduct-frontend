import "./login.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Inscription() {
  const [error, setError] = useState(""); // Pour afficher une erreur
  const [success, setSuccess] = useState(""); // Pour afficher un message de succès

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.nom.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setError("");
      console.log("Inscription réussie :", data);
      // Optionnel : rediriger vers login après quelques secondes
      // setTimeout(() => window.location.href = "/login", 2000);

    } catch (err) {
      setError(err.message);
      setSuccess("");
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
        <h2 style={{ textAlign: "center", color: "#4B5563", marginBottom: "1rem" }}>
          Inscrivez-vous en tant que Admin
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", color: "#4B5563" }}>
              Nom
            </label>
            <input
              type="text"
              name="nom"
              
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", color: "#4B5563" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", color: "#4B5563" }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
             
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <input type="checkbox" id="remember" style={{ marginRight: "0.5rem" }} />
            <label htmlFor="remember" style={{ color: "#4B5563", fontSize: "0.875rem" }}>
              Accepter les termes et la politique
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
          >
            S'inscrire
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "white" }}>
          Vous avez déjà un compte ?{" "}
          <Link to="/login" style={{ color: "#FACC15", textDecoration: "underline" }}>
            Se connecter   vous
          </Link>
        </p>
      </div>
    </div>
  );
}
