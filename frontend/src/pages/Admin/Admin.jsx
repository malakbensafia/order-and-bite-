import React, { useState, useEffect } from "react";
import "./Admin.css";

import PlatsPage from "../../components/PlatsPage/PlatsPage";

import {
    FaStore, FaChartBar, FaBox, FaHamburger, FaUsers,
    FaTruck, FaGift, FaStar, FaCalendar, FaCreditCard,
    FaBars
} from "react-icons/fa";

import { supabase } from "../../api/supabaseClient";

const Admin = () => {

    const [page, setPage] = useState("profil");
    const [open, setOpen] = useState(false);

    // 🔥 PROMOTIONS STATES
    const [plats, setPlats] = useState([]);
    const [selectedPlats, setSelectedPlats] = useState([]);
    const [taux, setTaux] = useState(20);
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");

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

    // 🔥 CHARGER PLATS
    useEffect(() => {
        const fetchPlats = async () => {
            const { data } = await supabase.from("plat").select("*");
            setPlats(data || []);
        };

        fetchPlats();
    }, []);

    // 🔥 SELECT PLATS
    const togglePlat = (id) => {
        setSelectedPlats((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    // 🔥 CREATE PROMO
    const appliquerPromo = async () => {
        for (let idplat of selectedPlats) {
            await supabase.from("promotionplat").insert([
                {
                    idplat,
                    tauxreduction: taux,
                    datedebutpromo: debut,
                    datefinpromo: fin
                }
            ]);
        }

        alert("Promotion ajoutée !");
        setSelectedPlats([]);
    };

    return (
        <div className="admin-page">

            {/* HERO */}
            <div className="admin-hero">
                <div className="admin-hero-overlay">
                    <h1>Admin Dashboard</h1>
                    <p>Gestion complète du restaurant</p>
                </div>
            </div>

            <div className="admin-container">

                {/* SIDEBAR */}
                <div className={`sidebar ${open ? "open" : ""}`}>

                    {/* bouton menu */}
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
                                setOpen(false);
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
                                <h2>Order & Bite Dashboard</h2>
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

                    {page === "plats" && <PlatsPage />}

                    {page === "clients" && <h2>Clients</h2>}
                    {page === "livreurs" && <h2>Livreurs</h2>}

                    {/* PROMOTIONS */}
                    {page === "promotions" && (
                        <div>
                            <h2>Gestion des promotions</h2>

                            <div style={{ marginBottom: "20px" }}>
                                <select
                                    value={taux}
                                    onChange={(e) => setTaux(Number(e.target.value))}
                                >
                                    <option value={10}>10%</option>
                                    <option value={15}>15%</option>
                                    <option value={20}>20%</option>
                                    <option value={50}>50%</option>
                                    <option value={75}>75%</option>
                                </select>

                                <input
                                    type="date"
                                    onChange={(e) => setDebut(e.target.value)}
                                />

                                <input
                                    type="date"
                                    onChange={(e) => setFin(e.target.value)}
                                />

                                <button onClick={appliquerPromo}>
                                    Créer promotion
                                </button>
                            </div>

                            <hr />

                            <h3>Choisir les plats</h3>

                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {plats.map((p) => (
                                    <div
                                        key={p.idplat}
                                        onClick={() => togglePlat(p.idplat)}
                                        style={{
                                            padding: "10px",
                                            margin: "5px",
                                            border: "1px solid #ccc",
                                            cursor: "pointer",
                                            borderRadius: "8px",
                                            background: selectedPlats.includes(p.idplat)
                                                ? "green"
                                                : "white",
                                            color: selectedPlats.includes(p.idplat)
                                                ? "white"
                                                : "black"
                                        }}
                                    >
                                        {p.nomplat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {page === "fidelite" && <h2>Fidélité</h2>}
                    {page === "reservations" && <h2>Réservations</h2>}
                    {page === "paiements" && <h2>Paiements</h2>}

                </div>
            </div>
        </div>
    );
};

export default Admin;