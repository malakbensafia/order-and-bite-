import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
    FaMapMarkerAlt, FaHeart, FaPlus, FaTrash, FaUser,
    FaBars, FaEnvelope, FaPhone, FaShoppingBag, FaCalendarCheck,
    FaKeyboard, FaSatelliteDish, FaIdBadge
} from "react-icons/fa";
import supabase from "../../api/supabaseClient";

const Dashboard = ({ user }) => {
    const [page, setPage] = useState("adresses");
    const [open, setOpen] = useState(false);
    const menu = [
        { key: "profil", label: "Profil", icon: <FaUser /> },
        { key: "adresses", label: "Adresses", icon: <FaMapMarkerAlt /> },
        { key: "commandes", label: "Mes commandes", icon: <FaShoppingBag /> },
        { key: "reservations", label: "Mes réservations", icon: <FaCalendarCheck /> },
    ];

    const [addresses, setAddresses] = useState([]);
    const [mode, setMode] = useState("manuel");
    const [rue, setRue] = useState("");
    const [ville, setVille] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    // =========================
    // CHARGER LES ADRESSES DEPUIS SUPABASE
    // =========================
    useEffect(() => {
        if (user?.idutilisateur) {
            loadAddresses();
        }
    }, [user]);

    const loadAddresses = async () => {
        const { data, error } = await supabase
            .from("adresse")
            .select("*")
            .eq("idclient", user?.idutilisateur);

        if (error) {
            console.error("Erreur chargement:", error);
        } else {
            setAddresses(data);
        }
    };

    const searchBejaiaAddress = async (text) => {
    if (text.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
    }

    try {
        const res = await fetch(
            `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)} Béjaïa Algérie&addressdetails=1&limit=10`,
            { headers: { "Accept-Language": "fr" } }
        );

        const data = await res.json();

        const results = data
            .filter(item =>
                item.display_name?.toLowerCase().includes("béja") ||
                item.display_name?.toLowerCase().includes("beja")
            )
            .map((item) => ({
                rue: item.display_name.split(",")[0],
                ville: item.address?.city || item.address?.town || "Béjaïa",
                latitude: item.lat,
                longitude: item.lon
            }));

        setSuggestions(results);
        setShowSuggestions(true);

    } catch (err) {
        console.error("Erreur:", err);
    }
};

    const addAddress = async () => {
        if (mode === "manuel") {
            if (!rue || !ville) {
                alert("Veuillez remplir la rue et la ville");
                return;
            }
            
            // Récupérer les coordonnées via l'API
            let latitude = "36.7517";
            let longitude = "5.0643";
            
            try {
                const res = await fetch(
                    `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(rue)} ${encodeURIComponent(ville)}&limit=1`
                );
                const data = await res.json();
                if (data.length > 0) {
                    latitude = data[0].lat;
                    longitude = data[0].lon;
                }
            } catch (err) {
                console.error("Erreur géocodage:", err);
            }
            // 🔥 CHECK DOUBLON
const { data: existing } = await supabase
    .from("adresse")
    .select("*")
    .eq("idclient", user?.idutilisateur)
    .eq("rue", rue)
    .eq("ville", ville);

if (existing && existing.length > 0) {
    alert(" Cette adresse existe déjà !");
    return;
}
            // Sauvegarder dans Supabase
            const { error } = await supabase
                .from("adresse")
                .insert({
                    rue: rue,
                    ville: ville,
                    latitudeadrs: parseFloat(latitude),
                    longitudeadrs: parseFloat(longitude),
                    idclient: user?.idutilisateur
                });

            if (error) {
                alert("Erreur: " + error.message);
            } else {
                alert("Adresse ajoutée !");
                setRue("");
                setVille("");
                setSuggestions([]);
                setShowSuggestions(false);
                loadAddresses(); // Recharger la liste
            }
        } else {
            setGpsLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const newAddress = {
                        rue: "Position GPS",
                        ville: "Béjaïa",
                        latitudeadrs: position.coords.latitude,
                        longitudeadrs: position.coords.longitude,
                        idclient: user?.idutilisateur
                    };
                    
                    const { error } = await supabase
                        .from("adresse")
                        .insert(newAddress);

                    setGpsLoading(false);
                    
                    if (error) {
                        alert("Erreur: " + error.message);
                    } else {
                        alert("Position GPS ajoutée !");
                        loadAddresses();
                    }
                },
                (error) => {
                    console.log(error);
                    alert("Impossible de récupérer votre position");
                    setGpsLoading(false);
                }
            );
        }
    };

    const deleteAddress = async (index) => {
        const addressToDelete = addresses[index];
        const { error } = await supabase
            .from("adresse")
            .delete()
            .eq("idadrs", addressToDelete.idadrs);

        if (error) {
            alert("Erreur: " + error.message);
        } else {
            alert("Adresse supprimée");
            loadAddresses();
        }
    };

    return (
        <div className="client-container">

            {/* SIDEBAR */}
            <div className={`sidebar ${open ? "open" : "hidden"}`}>
                <button className="close-sidebar" onClick={() => setOpen(false)}>✕</button>
                {menu.map((m) => (
                    <button
                        key={m.key}
                        className={page === m.key ? "active" : ""}
                        onClick={() => { setPage(m.key); setOpen(false); }}
                    >
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            {/* TOPBAR */}
            <div className="topbar">
                <button className="burger" onClick={() => setOpen(true)}><FaBars /></button>
                <h2>Mon espace</h2>
            </div>

            {/* CONTENU */}
            <div className="client-dashboard">

                {page === "profil" && (
                    <div className="page">

                        <h2>Mon profil</h2>

                        <div className="profile-card">

                            <div className="profile-header">

                                <div className="avatar-icon">
                                    <FaUser />
                                </div>

                                <div>
                                    <h3>
                                        {user?.prenom} {user?.nom}
                                    </h3>

                                    <p className="role">
                                        <FaIdBadge /> Compte utilisateur
                                    </p>
                                </div>

                            </div>

                            <div className="profile-info">

                                <div className="info-row">
                                    <span>
                                        <FaUser /> Prénom
                                    </span>

                                    <strong>
                                        {user?.prenom}
                                    </strong>
                                </div>

                                <div className="info-row">
                                    <span>
                                        <FaUser /> Nom
                                    </span>

                                    <strong>
                                        {user?.nom}
                                    </strong>
                                </div>

                                <div className="info-row">
                                    <span>
                                        <FaEnvelope /> Email
                                    </span>

                                    <strong>
                                        {user?.email}
                                    </strong>
                                </div>

                                <div className="info-row">
                                    <span>
                                        <FaPhone /> Téléphone
                                    </span>

                                    <strong>
                                        {user?.telephone}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>
                )}

                {page === "adresses" && (
                    <div className="adresses-container">
                        <h2>Mes adresses</h2>

                        <div className="mode-buttons">
                            <button
                                className={mode === "manuel" ? "active-mode" : ""}
                                onClick={() => setMode("manuel")}
                            >
                                <FaKeyboard /> Adresse manuelle
                            </button>
                            <button
                                className={mode === "gps" ? "active-mode" : ""}
                                onClick={() => setMode("gps")}
                            >
                                <FaSatelliteDish /> GPS automatique
                            </button>
                        </div>

                        {mode === "manuel" && (
                            <div className="add-box">
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type="text"
                                        placeholder="Rue..."
                                        value={rue}
                                        onChange={(e) => {
                                            setRue(e.target.value);
                                            searchBejaiaAddress(e.target.value);
                                        }}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {suggestions.map((s, idx) => (
                                                <div
                                                    key={idx}
                                                    className="suggestion-item"
                                                    onMouseDown={() => {
                                                        setRue(s.rue);
                                                        setVille(s.ville);
                                                        setSuggestions([]);
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    <strong>{s.rue}</strong>
                                                    <br />
                                                    <small>{s.ville}</small>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ville..."
                                    value={ville}
                                    onChange={(e) => setVille(e.target.value)}
                                />
                                <button onClick={addAddress}>
                                    <FaPlus />
                                </button>
                            </div>
                        )}

                        {mode === "gps" && (
                            <div className="add-box">
                                <button
                                    className="gps-btn"
                                    onClick={addAddress}
                                    disabled={gpsLoading}
                                >
                                    <FaMapMarkerAlt /> {gpsLoading ? "Localisation en cours..." : "Utiliser ma position GPS"}
                                </button>
                            </div>
                        )}

                        <div className="adresses-list">
                            {addresses.length === 0 && (
                                <p className="no-address">Aucune adresse enregistrée.</p>
                            )}
                            {addresses.map((addr, i) => (
                                <div key={i} className="adresse-card">
                                    <div className="adresse-info">
                                        <p>{addr.rue}</p>
                                        <small>{addr.ville}</small>
                                        <small>Lat : {parseFloat(addr.latitudeadrs).toFixed(5)}, Lon : {parseFloat(addr.longitudeadrs).toFixed(5)}</small>
                                    </div>
                                    <div className="adresse-actions">
                                        <button className="btn-delete" onClick={() => deleteAddress(i)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {page === "commandes" && (
                    <div>
                        <h2>Mes commandes</h2>
                        <p>Aucune commande pour le moment.</p>
                    </div>
                )}

                {page === "reservations" && (
                    <div>
                        <h2>Mes réservations</h2>
                        <p>Aucune réservation pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;