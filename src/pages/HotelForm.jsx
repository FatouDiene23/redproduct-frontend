// src/pages/HotelForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./hotelform.css";

export default function HotelForm() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    prix_par_nuit: "",
    adresse: "",
    telephone: "",
    device: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // récupérer le token

    if (!token) {
      alert("Vous devez être connecté");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    // Debug : afficher le contenu de FormData
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/hotels", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // si ton API exige un token
        },
        body: data,
      });

      const result = await response.json(); // lire la réponse une seule fois
      console.log("Status:", response.status);
      console.log("Result:", result);

      if (!response.ok) throw new Error("Erreur lors de l'envoi du formulaire");

      alert("Hôtel créé avec succès !");
      // navigate("/accueil"); // redirection si besoin
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi du formulaire");
    }
  };

  return (
    <div className="hotel-form-page">
      <div className="hotel-form-container">
        {/* Header avec flèche retour */}
        <div className="form-header">
          <Link to="/accueil" className="back-link">←</Link>
          <h2 className="form-title">CREER UN NOUVEAU HOTEL</h2>
        </div>

        <form className="hotel-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <label>Nom de l'hôtel</label>
              <input
                type="text"
                name="nom"
                placeholder="Entrez le nom de l'hôtel"
                value={formData.nom}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Entrez l'email"
                value={formData.email}
                onChange={handleChange}
              />

              <label>Prix par nuit</label>
              <input
                type="number"
                name="prix_par_nuit"
                placeholder="Prix en FCFA"
                value={formData.prix_par_nuit}
                onChange={handleChange}
              />
            </div>

            <div className="form-col">
              <label>Adresse</label>
              <input
                type="text"
                name="adresse"
                placeholder="Entrez l'adresse"
                value={formData.adresse}
                onChange={handleChange}
              />

              <label>Numéro de téléphone</label>
              <input
                type="text"
                name="telephone"
                placeholder="Entrez le numéro"
                value={formData.telephone}
                onChange={handleChange}
              />

              <label>Device</label>
              <input
                type="text"
                name="device"
                placeholder="F CFA"
                value={formData.device}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Upload photo */}
          <div className="form-photo">
            <label>Ajouter une photo</label>
            <label className="photo-upload-box" htmlFor="hotel-photo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>{formData.photo ? formData.photo.name : "Ajouter une image"}</span>
            </label>
            <input
              type="file"
              id="hotel-photo"
              name="photo"
              style={{ display: "none" }}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
