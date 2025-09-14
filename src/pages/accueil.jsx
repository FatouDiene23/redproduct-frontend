// src/pages/Accueil.jsx
import React, { useState, useEffect } from "react";
import {
  Home,
  Hotel,
  Bell,
  LogOut,
  Search,
  Mail,
  User,
  Building2,
  FileText,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./accueil.css";

export default function Accueil() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [hotelsCards, setHotelsCards] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("CFA");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Infos utilisateur
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [editForm, setEditForm] = useState({
    nom: "",
    email: "",
    prix_par_nuit: "",
    adresse: "",
    telephone: "",
    device: "",
    photo: null,
  });

  const navigate = useNavigate();

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Erreur logout :", error);
      navigate("/login");
    }
  };

  // 🔹 Dashboard cards
  const dashboardCards = [
    { icon: FileText, color: "purple", title: "Formulaires", text: "Je ne sais pas quoi mettre", value: 125 },
    { icon: MessageSquare, color: "green", title: "Messages", text: "Je ne sais pas quoi mettre", value: 40 },
    { icon: User, color: "yellow", title: "Utilisateurs", text: "Je ne sais pas quoi mettre", value: 600 },
    { icon: Mail, color: "red", title: "E-mails", text: "Je ne sais pas quoi mettre", value: 25 },
    { icon: Hotel, color: "purple", title: "Hôtels", text: "Je ne sais pas quoi mettre", value: 40 },
    { icon: Building2, color: "blue", title: "Entités", text: "Je ne sais pas quoi mettre", value: 2 },
  ];

  // 🔹 Charger utilisateur depuis localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 🔹 Récupérer hôtels
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/hotels");
      const data = await response.json();
      const cards = data.map((hotel) => ({
        id: hotel.id,
        title: hotel.nom,
        adresse: hotel.adresse,
        prix_par_nuit: hotel.prix_par_nuit,
        device: hotel.device || "CFA",
        image: hotel.photo
          ? `http://127.0.0.1:8000/storage/${hotel.photo}`
          : "https://via.placeholder.com/300x200",
        raw: hotel,
      }));
      setHotelsCards(cards);
    } catch (error) {
      console.error("Erreur lors de la récupération des hôtels :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === "hotels") fetchHotels();
  }, [activeMenu]);

  // 🔹 Recherche
  const filteredHotels = hotelsCards.filter((hotel) => {
    const term = searchTerm.toLowerCase();
    return (
      hotel.title.toLowerCase().includes(term) ||
      hotel.adresse.toLowerCase().includes(term)
    );
  });

  // 🔹 Cartes à afficher
  const cardsToDisplay = activeMenu === "dashboard" ? dashboardCards : filteredHotels;

  // 🔹 Conversion prix
  const convertPrice = (prix, currentDevice) => {
    if (!prix) return "";

    const rates = {
      CFA: { CFA: 1, EUR: 0.0015, USD: 0.0017 },
      EUR: { CFA: 655, EUR: 1, USD: 1.1 },
      USD: { CFA: 600, EUR: 0.9, USD: 1 },
    };

    const from = currentDevice || "CFA";
    const to = selectedCurrency || "CFA";
    const rate = rates[from]?.[to] || 1;

    const converted = prix * rate;
    return `${converted.toFixed(2)} ${to} par nuit`;
  };

  // 🔹 Modal édition hôtel
  const openEditModal = (card) => {
    const raw = card.raw || {};
    setEditingHotel(raw);
    setEditForm({
      nom: raw.nom || "",
      email: raw.email || "",
      prix_par_nuit: raw.prix_par_nuit || "",
      adresse: raw.adresse || "",
      telephone: raw.telephone || "",
      device: raw.device || "CFA",
      photo: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setEditForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("nom", editForm.nom);
      formData.append("email", editForm.email ?? "");
      formData.append("prix_par_nuit", editForm.prix_par_nuit ?? "");
      formData.append("adresse", editForm.adresse ?? "");
      formData.append("telephone", editForm.telephone ?? "");
      formData.append("device", editForm.device ?? "");
      if (editForm.photo) formData.append("photo", editForm.photo);
      formData.append("_method", "PUT");

      const res = await fetch(`http://127.0.0.1:8000/api/hotels/${editingHotel.id}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Erreur update:", err);
        alert("Erreur lors de la modification. Voir console.");
        return;
      }

      setEditingHotel(null);
      fetchHotels();
    } catch (error) {
      console.error("Erreur handleUpdate:", error);
      alert("Erreur lors de la modification (voir console).");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (card) => {
    if (!window.confirm(`Confirmer la suppression de "${card.title}" ?`)) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/hotels/${card.id}`, {
        method: "DELETE",
        headers: token
          ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          : { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Erreur suppression:", err);
        alert("Erreur lors de la suppression (voir console).");
        return;
      }

      fetchHotels();
    } catch (error) {
      console.error("Erreur handleDelete:", error);
      alert("Erreur lors de la suppression (voir console).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logo flex items-center gap-2">
            <img src="/src/assets/logo.png" alt="logo" className="w-6 h-6" />
            RED PRODUCT
          </div>
          <nav className="menu">
            <a
              href="#"
              className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveMenu("dashboard")}
            >
              <Home size={18} className="icon" /> Dashboard
            </a>
            <a
              href="#"
              className={`menu-item ${activeMenu === "hotels" ? "active" : ""}`}
              onClick={() => setActiveMenu("hotels")}
            >
              <Hotel size={18} className="icon" /> Liste des hôtels
            </a>
          </nav>
        </div>

        <div className="profile">
          <img src="https://i.pravatar.cc/40" alt="Profil" className="profile-img" />
          <div>
            <p className="profile-name">{user?.name || "Utilisateur"}</p>
            <p className="profile-status">● en ligne</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <h1 className="topbar-title">{activeMenu === "dashboard" ? "Dashboard" : "Liste des hôtels"}</h1>
          <div className="topbar-actions">
            {activeMenu === "hotels" && (
              <div className="currency-dropdown">
                <button className="currency-btn" onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}>
                  {selectedCurrency}
                </button>
                {showCurrencyMenu && (
                  <div className="currency-menu">
                    <div onClick={() => { setSelectedCurrency("CFA"); setShowCurrencyMenu(false); }}>F XOF</div>
                    <div onClick={() => { setSelectedCurrency("EUR"); setShowCurrencyMenu(false); }}>Euro</div>
                    <div onClick={() => { setSelectedCurrency("USD"); setShowCurrencyMenu(false); }}>Dollar</div>
                  </div>
                )}
              </div>
            )}

            {/* 🔹 Recherche */}
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Recherche"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Bell size={20} className="topbar-icon" />
            {/* 🔹 Déconnexion */}
            <LogOut
              size={20}
              className="topbar-icon"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            />
            {/* 🔹 Avatar cliquable */}
            <img
              src="https://i.pravatar.cc/35"
              alt="Profil"
              className="topbar-profile"
              style={{ cursor: "pointer" }}
              onClick={() => setShowProfileModal(true)}
            />
          </div>
        </header>

        <main className="content">
          <div className="title-row">
            <h2 className="welcome">
              {activeMenu === "dashboard"
                ? "Bienvenue sur RED Product"
                : `Hôtels (${filteredHotels.length})`}
            </h2>
            {activeMenu === "hotels" && (
              <Link to="/Ajout" className="create-input">
                <span className="create-plus">+</span>
                <span className="create-text">Créer un nouveau hôtel</span>
              </Link>
            )}
          </div>

          {activeMenu === "dashboard" && <p className="subtitle">Lorem ipsum dolor sit amet consectetur.</p>}

          <div className="cards">
            {cardsToDisplay.map((card, index) => (
              <div key={index} className="card">
                {activeMenu === "hotels" ? (
                  <div className="hotel-card">
                    <img src={card.image} alt={card.title} className="card-image" />
                    <div className="hotel-info">
                      <p className="hotel-address">{card.adresse}</p>
                      <p className="hotel-name">{card.title}</p>
                      <p className="hotel-price">{convertPrice(card.prix_par_nuit, card.device)}</p>
                    </div>

                    <div className="hotel-actions">
                      <button className="btn-edit" onClick={() => openEditModal(card)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(card)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`card-icon ${card.color}`}>
                    <card.icon size={22} />
                  </div>
                )}
                {activeMenu !== "hotels" && (
                  <div>
                    <p className="card-title">{card.value} {card.title}</p>
                    <p className="card-text">{card.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {loading && <p style={{ marginTop: 12 }}>Chargement...</p>}
        </main>
      </div>

      {/* Modal édition hôtel */}
      {editingHotel && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Modifier l'hôtel</h3>
            <form onSubmit={handleUpdate} className="modal-form">
              <label>Nom</label>
              <input name="nom" value={editForm.nom} onChange={handleEditChange} required />

              <label>Email</label>
              <input name="email" value={editForm.email} onChange={handleEditChange} />

              <label>Prix par nuit</label>
              <input name="prix_par_nuit" type="number" step="0.01" value={editForm.prix_par_nuit} onChange={handleEditChange} />

              <label>Adresse</label>
              <input name="adresse" value={editForm.adresse} onChange={handleEditChange} />

              <label>Téléphone</label>
              <input name="telephone" value={editForm.telephone} onChange={handleEditChange} />

              <label>Device</label>
              <input name="device" value={editForm.device} onChange={handleEditChange} />

              {editingHotel.photo && (
                <div style={{ marginBottom: "10px" }}>
                  <p>Image actuelle :</p>
                  <img src={`http://127.0.0.1:8000/storage/${editingHotel.photo}`} alt="aperçu" style={{ width: "150px", borderRadius: "8px" }} />
                </div>
              )}

              <label>Nouvelle photo</label>
              <input name="photo" type="file" accept="image/*" onChange={handleEditChange} />

              <div className="form-actions modal-actions">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={() => setEditingHotel(null)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal profil utilisateur */}
      {showProfileModal && user && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Mon Profil</h3>
            <p><strong>Nom :</strong> {user.name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Créé le :</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            <div className="form-actions modal-actions">
              <button onClick={() => setShowProfileModal(false)} className="btn-cancel">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
