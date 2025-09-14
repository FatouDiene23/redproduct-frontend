import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css"; // ton style actuel

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur");

      setMessage("Mot de passe réinitialisé avec succès ✅");
      setError("");

      // redirection après 2 secondes
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container" style={{ maxWidth: "400px", margin: "3rem auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Réinitialiser le mot de passe</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
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
            Réinitialiser
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/login" style={{ color: "#FACC15" }}>Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
