import "./login.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur");

      setMessage("Lien de réinitialisation envoyé à votre email 📩");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
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
        <div className="login-title">
          <img src="/src/assets/logo.png" alt="logo" className="w-6 h-6" />RED PRODUCT
        </div>
      </div>

      <div className="login-container">
        <h3 style={{ marginBottom: "2rem" }}>Mot de passe oublié ?</h3>
        <p style={{ marginBottom: "2rem" }}>
          Entrez votre adresse email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "3rem" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre e-mail"
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                outline: "none",
              }}
            />
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
            Envoyer
          </button>
        </form>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "white" }}>
          Revenir à la{" "}
          <Link to="/login" style={{ color: "#FACC15", textDecoration: "underline" }}>
            connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
