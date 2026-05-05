import React, { useState } from "react";
import "./Livreur.css";
import {
    FaBox,
    FaTruck,
    FaCheck,
    FaMapMarkerAlt,
    FaUser,
    FaMoneyBill,
    FaBars
} from "react-icons/fa";

const Livreur = () => {

    const [page, setPage] = useState("commandes");
    const [open, setOpen] = useState(false); // 🔥 TOGGLE

    const menu = [
        { key: "profil", label: "Profil", icon: <FaUser /> },
        { key: "commandes", label: "Commandes disponibles", icon: <FaBox /> },
        { key: "enCours", label: "En cours", icon: <FaTruck /> },
        { key: "livrees", label: "Livrées", icon: <FaCheck /> },
        { key: "revenus", label: "Revenus", icon: <FaMoneyBill /> },
        { key: "carte", label: "Carte", icon: <FaMapMarkerAlt /> },
    ];

    return (
        <div className="livreur-page">

            {/* HERO */}
            <div className="livreur-hero">
                <div className="livreur-hero-overlay">
                    <h1>Espace Livreur</h1>
                    <p>Gérez vos livraisons en temps réel</p>
                </div>
            </div>

            {/* CONTAINER */}
            <div className="livreur-container">

                {/* SIDEBAR */}
                <div className={`sidebar ${open ? "open" : ""}`}>

                    {/* TOGGLE */}
                    <button className="toggle-btn" onClick={() => setOpen(!open)}>
                        <FaBars />
                    </button>

                    <h2>Livreur</h2>

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

                    {page === "commandes" && (
                        <div>
                            <h2>📦 Commandes disponibles</h2>
                        </div>
                    )}

                    {page === "enCours" && (
                        <div>
                            <h2>🚚 Livraisons en cours</h2>
                        </div>
                    )}

                    {page === "livrees" && (
                        <div>
                            <h2>✅ Livrées</h2>
                        </div>
                    )}

                    {page === "revenus" && (
                        <div>
                            <h2>💰 Revenus</h2>
                        </div>
                    )}

                    {page === "profil" && (
                        <div className="profil-livreur-container">
                            <div className="profil-livreur-overlay">
                                <div className="profil-header">
                                    <h2>Mon profil livreur</h2>
                                </div>

                                <div className="profil-cards">
                                    <div className="profil-card">
                                        <h4>Nom</h4>
                                        <p>Livreur 01</p>
                                    </div>

                                    <div className="profil-card">
                                        <h4>Téléphone</h4>
                                        <p>05 XX XX XX XX</p>
                                    </div>

                                    <div className="profil-card status">
                                        <h4>Statut</h4>
                                        <p>Disponible</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Livreur;