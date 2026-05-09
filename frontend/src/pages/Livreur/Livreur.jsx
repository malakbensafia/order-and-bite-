import React, { useState } from "react";
import "./Livreur.css";
import LivraisonsEnCours from "../../components/LivraisonsEnCours/LivraisonsEnCours";
import {
    FaBox,
    FaTruck,
    FaCheck,
    FaMapMarkerAlt,
    FaUser,
    FaMoneyBill,
    FaBars
} from "react-icons/fa";
import CommandesLivreur from "../../components/CommandesLivreur/CommandesLivreur";
import ProfilLivreur from "../../components/ProfilLivreur/ProfilLivreur";
import LivreesLivreur from "../../components/LivreesLivreur/LivreesLivreur";

const Livreur = () => {

    const [page, setPage] = useState("commandes");
    const [open, setOpen] = useState(false); // 🔥 TOGGLE

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

                    {page === "commandes" && <CommandesLivreur/>}

                    {page === "enCours" && <LivraisonsEnCours />}

                    {page === "livrees" && <LivreesLivreur />}

                   
                    {page === "profil" && <ProfilLivreur />}

                </div>

            </div>

        </div>
    );
};

export default Livreur;