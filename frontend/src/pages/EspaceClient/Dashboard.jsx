import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
    FaMapMarkerAlt, FaPlus, FaTrash, FaUser, FaBars,
    FaEnvelope, FaPhone, FaShoppingBag, FaCalendarCheck,
    FaKeyboard, FaSatelliteDish, FaIdBadge, FaStar
} from "react-icons/fa";
import {
    loadAddresses,
    searchBejaiaAddress,
    addAddressManuelle,
    addAddressGPS,
    deleteAddress
} from "../../api/adresseApi";
import SuiviLivraison from "../../components/SuiviLivraison/SuiviLivraison";
import ReservationsClient from "../../components/ReservationsClient/ReservationsClient";
import { getPoints, getHistorique } from "../../api/fideliteApi";
import MesCommandes from "../../components/MesCommandes/MesCommandes";

const labelType = (type) => {
    switch (type) {
        case "commande_livree": return "Commande livrée";
        case "avis_laisse": return "Avis laissé";
        case "bonus_depenses": return "Bonus 10 000 DA";
        case "utilisation": return "Points utilisés";
        default: return type;
    }
};

const Dashboard = ({ user }) => {
    const [page, setPage] = useState("adresses");
    const [open, setOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [mode, setMode] = useState("manuel");
    const [rue, setRue] = useState("");
    const [ville, setVille] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);


    const [points, setPoints] = useState(0);
    const [historique, setHistorique] = useState([]);

    const menu = [
        { key: "profil", label: "Profil", icon: <FaUser /> },
        { key: "adresses", label: "Adresses", icon: <FaMapMarkerAlt /> },
        { key: "commandes", label: "Mes commandes", icon: <FaShoppingBag /> },
        { key: "reservations", label: "Mes réservations", icon: <FaCalendarCheck /> },
        { key: "suivi", label: "Suivi livraison", icon: <FaMapMarkerAlt /> },
        { key: "fidelite", label: "Fidélité", icon: <FaStar /> },
    ];

    useEffect(() => {
        if (user?.idutilisateur) {
            fetchAddresses();
            getPoints(user.idutilisateur).then(setPoints);
            getHistorique(user.idutilisateur).then(setHistorique);
        }
    }, [user]);

    const fetchAddresses = async () => {
        const data = await loadAddresses(user?.idutilisateur);
        setAddresses(data);
    };

    const handleSearch = async (text) => {
        setRue(text);
        if (text.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
        const results = await searchBejaiaAddress(text);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
    };

    const handleAddManuelle = async () => {
        if (!rue || !ville) { alert("Veuillez remplir la rue et la ville"); return; }
        const result = await addAddressManuelle(rue, ville, user?.idutilisateur);
        if (result.error === "doublon") { alert("Cette adresse existe déjà !"); return; }
        if (result.error) { alert("Erreur : " + result.error); return; }
        alert("Adresse ajoutée !");
        setRue(""); setVille("");
        setSuggestions([]); setShowSuggestions(false);
        fetchAddresses();
    };

    const handleAddGPS = () => {
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const result = await addAddressGPS(
                    position.coords.latitude,
                    position.coords.longitude,
                    user?.idutilisateur
                );
                setGpsLoading(false);
                if (result.error) { alert("Erreur : " + result.error); return; }
                alert("Position GPS ajoutée !");
                fetchAddresses();
            },
            (err) => {
                console.log(err);
                alert("Impossible de récupérer votre position");
                setGpsLoading(false);
            }
        );
    };

    const handleDelete = async (idadrs) => {
        const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?");
        if (!confirm) return;
        const result = await deleteAddress(idadrs);
        if (result.error) { alert("Erreur : " + result.error); return; }
        alert("Adresse supprimée");
        fetchAddresses();
    };

    return (
        <div className="client-container">

            <div className={`sidebar ${open ? "open" : "hidden"}`}>
                <button className="close-sidebar" onClick={() => setOpen(false)}>✕</button>
                {menu.map((m) => (
                    <button key={m.key} className={page === m.key ? "active" : ""}
                        onClick={() => { setPage(m.key); setOpen(false); }}>
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            <div className="client-dashboard">
                <button className="burger-btn" onClick={() => setOpen(true)}>
                    <FaBars /> Menu
                </button>

                {/* PROFIL */}
                {page === "profil" && (
                    <div className="page">
                        <h2>Mon profil</h2>
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="avatar-icon"><FaUser /></div>
                                <div>
                                    <h3>{user?.prenom} {user?.nom}</h3>
                                    <p className="role"><FaIdBadge /> Compte utilisateur</p>
                                </div>
                            </div>
                            <div className="profile-info">
                                <div className="info-row"><span><FaUser /> Prénom</span><strong>{user?.prenom}</strong></div>
                                <div className="info-row"><span><FaUser /> Nom</span><strong>{user?.nom}</strong></div>
                                <div className="info-row"><span><FaEnvelope /> Email</span><strong>{user?.email}</strong></div>
                                <div className="info-row"><span><FaPhone /> Téléphone</span><strong>{user?.telephone}</strong></div>

                                <div className="info-row">
                                    <span><FaStar color="#f5a623" /> Points fidélité</span>
                                    <strong>{points} pts</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADRESSES */}
                {page === "adresses" && (
                    <div className="adresses-container">
                        <h2>Mes adresses</h2>

                        <div className="mode-buttons">
                            <button className={mode === "manuel" ? "active-mode" : ""} onClick={() => setMode("manuel")}>
                                <FaKeyboard /> Adresse manuelle
                            </button>
                            <button className={mode === "gps" ? "active-mode" : ""} onClick={() => setMode("gps")}>
                                <FaSatelliteDish /> GPS automatique
                            </button>
                        </div>

                        {mode === "manuel" && (
                            <div className="add-box">
                                <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                        type="text" placeholder="Rue..."
                                        value={rue}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {suggestions.map((s, idx) => (
                                                <div key={idx} className="suggestion-item"
                                                    onMouseDown={() => {
                                                        setRue(s.rue); setVille(s.ville);
                                                        setSuggestions([]); setShowSuggestions(false);
                                                    }}>
                                                    <strong>{s.rue}</strong><br />
                                                    <small>{s.ville}</small>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input type="text" placeholder="Ville..." value={ville} onChange={(e) => setVille(e.target.value)} />
                                <button onClick={handleAddManuelle}><FaPlus /></button>
                            </div>
                        )}

                        {mode === "gps" && (
                            <div className="add-box">
                                <input type="text" value="Position GPS" disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
                                <input type="text" value="Béjaïa" disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
                                <button className="gps-btn" onClick={handleAddGPS} disabled={gpsLoading}>
                                    <FaMapMarkerAlt /> {gpsLoading ? "Localisation..." : "Utiliser ma position GPS"}
                                </button>
                            </div>
                        )}

                        <div className="adresses-list">
                            {addresses.length === 0 && <p className="no-address">Aucune adresse enregistrée.</p>}
                            {addresses.map((addr, i) => (
                                <div key={i} className="adresse-card">
                                    <div className="adresse-info">
                                        <p>{addr.rue || " Position GPS"}</p>
                                        <small>{addr.ville}</small>
                                        <small>Lat : {parseFloat(addr.latitudeadrs).toFixed(5)}, Lon : {parseFloat(addr.longitudeadrs).toFixed(5)}</small>
                                    </div>
                                    <div className="adresse-actions">
                                        <button className="btn-delete" onClick={() => handleDelete(addr.idadrs)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {page === "commandes" && <MesCommandes user={user} />}
                {page === "reservations" && <ReservationsClient user={user} />}
                {page === "suivi" && <SuiviLivraison />}

                {/*  AJOUTÉ — PAGE FIDÉLITÉ */}
                {page === "fidelite" && (
                    <div className="page">
                        <h2>Mon programme fidélité</h2>

                        <div className="profile-card" style={{ marginBottom: "1.5rem" }}>
                            <div className="profile-header">
                                <div className="avatar-icon"><FaStar /></div>
                                <div>
                                    <h3>{points} points</h3>
                                    <p className="role">disponibles</p>
                                </div>
                            </div>
                            <div className="profile-info">
                                <div className="info-row"><span>Commande livrée</span><strong>+10 pts</strong></div>
                                <div className="info-row"><span>Avis laissé</span><strong>+20 pts</strong></div>
                                <div className="info-row"><span>10 000 DA dépensés</span><strong>+100 pts</strong></div>
                                <div className="info-row"><span>100 pts utilisés</span><strong>= 10% de réduction</strong></div>
                            </div>
                            {points < 100 && (
                                <p style={{ marginTop: "1rem", color: "#888", fontSize: 13 }}>
                                    Il vous manque <strong>{100 - points} pts</strong> pour obtenir une réduction.
                                </p>
                            )}
                        </div>

                        <h3 style={{ marginBottom: "0.75rem" }}>Historique des points</h3>
                        {historique.length === 0 && (
                            <p style={{ color: "#888" }}>Aucun historique pour le moment.</p>
                        )}
                        {historique.map((h) => (
                            <div key={h.idhistorique} className="adresse-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{labelType(h.typehist)}</p>
                                    <small style={{ color: "#888" }}>
                                        {new Date(h.datehist).toLocaleDateString("fr", { day: "2-digit", month: "long", year: "numeric" })}
                                    </small>
                                </div>
                                <strong style={{ color: h.valhist > 0 ? "green" : "red", fontSize: 16 }}>
                                    {h.valhist > 0 ? "+" : ""}{h.valhist} pts
                                </strong>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );

};

export default Dashboard;