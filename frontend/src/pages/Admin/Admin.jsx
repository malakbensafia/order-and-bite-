import React, { useState, useEffect, useContext } from "react"; // 👈 useContext ajouté
import "./Admin.css";
import ClientsPage from "../../components/ClientsPage/ClientsPage";
import LivreursPage from "../../components/LivreursPage/LivreursPage";
import PlatsPage from "../../components/PlatsPage/PlatsPage";

import {
    FaStore, FaChartBar, FaBox, FaHamburger, FaUsers,
    FaTruck, FaGift, FaStar, FaCalendar, FaCreditCard,
    FaBars
} from "react-icons/fa";

import { supabase } from "../../api/supabaseClient";
import { StoreContext } from "../../context/StoreContext"; // 👈 AJOUTÉ

const Admin = () => {

    const { refreshPlats } = useContext(StoreContext); // 👈 AJOUTÉ

    const [page, setPage] = useState("profil");
    const [open, setOpen] = useState(false);

    // 🔥 PROMOTIONS STATES
    const [plats, setPlats] = useState([]);
    const [selectedPlats, setSelectedPlats] = useState([]);
    const [taux, setTaux] = useState(20);
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");
    const [promotions, setPromotions] = useState([]);

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

    // 🔥 CHARGER PROMOTIONS
    useEffect(() => {
        const fetchPromotions = async () => {
            const { data } = await supabase
                .from("promotionplat")
                .select(`*, plat(nomplat)`);
            setPromotions(data || []);
        };
        fetchPromotions();
    }, []);

    // 🔥 SELECT PLATS
    const togglePlat = (id) => {
        setSelectedPlats((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    // 🔥 SUPPRIMER PROMO
    const supprimerPromo = async (idpromoplat) => {
        await supabase
            .from("promotionplat")
            .delete()
            .eq("idpromoplat", idpromoplat);

        setPromotions(prev => prev.filter(p => p.idpromoplat !== idpromoplat));
        await refreshPlats(); // 👈 AJOUTÉ
    };

    // 🔥 CREATE PROMO
    const appliquerPromo = async () => {
        if (!debut || !fin) {
            alert("Veuillez remplir les deux dates !");
            return;
        }

        if (new Date(debut) >= new Date(fin)) {
            alert("La date de début doit être inférieure à la date de fin !");
            return;
        }

        if (selectedPlats.length === 0) {
            alert("Veuillez sélectionner au moins un plat !");
            return;
        }

        for (let idplat of selectedPlats) {
            const { data } = await supabase
                .from("promotionplat")
                .insert([{
                    idplat,
                    tauxreduction: taux,
                    datedebutpromo: debut,
                    datefinpromo: fin
                }])
                .select(`*, plat(nomplat)`)
                .single();

            if (data) {
                setPromotions(prev => [...prev, data]);
            }
        }

        alert("Promotion ajoutée !");
        setSelectedPlats([]);
        await refreshPlats(); // 👈 AJOUTÉ
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
                    {page === "clients" && <ClientsPage />}
                    {page === "livreurs" && <LivreursPage />}

                    {/* PROMOTIONS */}
                    {page === "promotions" && (
                        <div className="promotions-container">
                            <h2>Gestion des promotions</h2>

                            <div className="promo-form">
                                <div className="promo-form-row">
                                    <label>Taux de réduction</label>
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
                                </div>

                                <div className="promo-form-row">
                                    <label>Date début</label>
                                    <input
                                        type="date"
                                        value={debut}
                                        onChange={(e) => setDebut(e.target.value)}
                                    />
                                </div>

                                <div className="promo-form-row">
                                    <label>Date fin</label>
                                    <input
                                        type="date"
                                        value={fin}
                                        onChange={(e) => setFin(e.target.value)}
                                    />
                                </div>

                                <button className="promo-btn" onClick={appliquerPromo}>
                                    Créer promotion
                                </button>
                            </div>

                            <hr />

                            <h3>Choisir les plats</h3>
                            <div className="promo-plats-grid">
                                {plats.map((p) => (
                                    <div
                                        key={p.idplat}
                                        onClick={() => togglePlat(p.idplat)}
                                        className={`promo-plat-card ${selectedPlats.includes(p.idplat) ? "selected" : ""}`}
                                    >
                                        {p.nomplat}
                                    </div>
                                ))}
                            </div>

                            <hr />

                            <h3>Promotions actives</h3>
                            <div className="promo-list">
                                {promotions.length === 0 && <p>Aucune promotion</p>}
                                {promotions.map((promo) => (
                                    <div key={promo.idpromoplat} className="promo-item">
                                        <span className="promo-plat-name">{promo.plat?.nomplat}</span>
                                        <span className="promo-taux">{promo.tauxreduction}%</span>
                                        <span className="promo-dates">
                                            {promo.datedebutpromo} → {promo.datefinpromo}
                                        </span>
                                        <button
                                            className="promo-delete-btn"
                                            onClick={() => supprimerPromo(promo.idpromoplat)}
                                        >
                                            Supprimer
                                        </button>
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