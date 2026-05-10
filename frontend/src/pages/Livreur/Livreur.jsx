import React, { useState } from "react";
import "./Livreur.css";
import LivraisonsEnCours from "../../components/LivraisonsEnCours/LivraisonsEnCours";
import {
    FaBox,
    FaTruck,
    FaCheck,
    FaUser,
    FaBars,
    FaTimes
} from "react-icons/fa";
import CommandesLivreur from "../../components/CommandesLivreur/CommandesLivreur";
import ProfilLivreur from "../../components/ProfilLivreur/ProfilLivreur";
import LivreesLivreur from "../../components/LivreesLivreur/LivreesLivreur";

const Livreur = () => {

    const [page, setPage] = useState("commandes");
    const [open, setOpen] = useState(false);

    const menu = [
        { key: "profil", label: "Profil", icon: <FaUser /> },
        { key: "commandes", label: "Commandes disponibles", icon: <FaBox /> },
        { key: "enCours", label: "En cours", icon: <FaTruck /> },
        { key: "livrees", label: "Livrées", icon: <FaCheck /> },
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

                {/* SIDEBAR — toujours visible desktop, cachée mobile */}
                <div className={`sidebar ${open ? "open" : ""}`}>

                    {/* ✕ visible uniquement sur mobile */}
                    <button className="close-sidebar" onClick={() => setOpen(false)}>
                        <FaTimes />
                    </button>

                    <h2>Livreur</h2>

                    {menu.map(item => (
                        <button
                            key={item.key}
                            className={page === item.key ? "active" : ""}
                            onClick={() => {
                                setPage(item.key);
                                setOpen(false);
                            }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="content">

                    {/* BURGER — caché desktop, visible mobile */}
                    <button className="burger-btn" onClick={() => setOpen(!open)}>
                        <FaBars /> Menu
                    </button>

                    {page === "commandes" && <CommandesLivreur />}
                    {page === "enCours" && <LivraisonsEnCours />}
                    {page === "livrees" && <LivreesLivreur />}
                    {page === "profil" && <ProfilLivreur />}

                </div>

            </div>

        </div>
    );
};

export default Livreur;