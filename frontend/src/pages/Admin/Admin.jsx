import React, { useState } from "react";
import "./Admin.css";

import {
  FaStore, FaChartBar, FaBox, FaHamburger, FaUsers,
  FaTruck, FaGift, FaStar, FaCalendar, FaCreditCard,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaBolt,
  FaBars
} from "react-icons/fa";

const Admin = () => {

  const [page, setPage] = useState("profil"); // ✔ laissé comme tu veux
  const [open, setOpen] = useState(false); // 🔥 toggle mobile

  const menu = [
    { key: "profil", label: "Profil", icon: <FaStore /> },
    { key: "dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { key: "commandes", label: "Commandes", icon: <FaBox /> },
    { key: "plats", label: "Plats", icon: <FaHamburger /> },
    { key: "clients", label: "Clients", icon: <FaUsers /> },
    { key: "livreurs", label: "Livreurs", icon: <FaTruck /> },
    { key: "promotions", label: "Promotions", icon: <FaGift /> },
    { key: "fidelite", label: "Fidélité", icon: <FaStar /> },
    { key: "reservations", label: "Réservations", icon: <FaCalendar /> },
    { key: "paiements", label: "Paiements", icon: <FaCreditCard /> },
  ];

  return (
    <div className="admin-page">

      
      <div className="admin-hero">
        <div className="admin-hero-overlay">
          <h1>Admin Dashboard</h1>
          <p>Gestion complète du restaurant</p>
        </div>
      </div>

      {/* CONTAINER */}
      <div className="admin-container">

        {/* SIDEBAR */}
        <div className={`sidebar ${open ? "open" : ""}`}>

          {/* TOGGLE BTN */}
          <button className="toggle-btn" onClick={() => setOpen(!open)}>
            <FaBars />
          </button>

          <h2>Admin</h2>

          {menu.map(item => (
            <button
              key={item.key}
              className={page === item.key ? "active" : ""}
              onClick={() => {
                setPage(item.key);
                setOpen(false); // 🔥 ferme menu après clic
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="content">

          {page === "profil" && (
            <div className="profil-container">
              <div className="profil-overlay">

                <div className="profil-title">
                  <h2>Order & Bite Dashboard</h2>
                  <p>Gestion et informations générales</p>
                </div>

                <div className="profil-info">
                  <div className="info-card">
                    <span><FaMapMarkerAlt /> Adresse</span>
                    <p>Béjaia</p>
                  </div>

                  <div className="info-card">
                    <span><FaPhone /> Téléphone</span>
                    <p>05-65-43-34-22</p>
                  </div>

                  <div className="info-card">
                    <span><FaEnvelope /> Email</span>
                    <p>contact@orderbite.com</p>
                  </div>

                  <div className="info-card">
                    <span><FaClock /> Horaires</span>
                    <p>08:00 - 23:00</p>
                  </div>

                  <div className="info-card status">
                    <span><FaBolt /> Statut</span>
                    <p>Ouvert</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {page === "dashboard" && (
            <div className="stats">
              <div className="card">CA : 120000 DA</div>
              <div className="card">Commandes : 320</div>
              <div className="card">Clients : 150</div>
              <div className="card">Livreurs actifs : 5</div>
            </div>
          )}

          {page === "commandes" && <h2>Commandes</h2>}
          {page === "plats" && <h2>Gestion des plats</h2>}
          {page === "clients" && <h2>Clients</h2>}
          {page === "livreurs" && <h2>Livreurs</h2>}
          {page === "promotions" && <h2>Promotions</h2>}
          {page === "fidelite" && <h2>Fidélité</h2>}
          {page === "reservations" && <h2>Réservations</h2>}
          {page === "paiements" && <h2>Paiements</h2>}

        </div>

      </div>

    </div>
  );
};

export default Admin;