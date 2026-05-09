import React, { useState, useEffect } from "react";
import { getCommandesClient, getLignesCommande } from "../../api/commandeApi";
import { FaShoppingBag, FaCalendarAlt, FaCheckCircle, FaClock, FaTruck, FaTimes } from "react-icons/fa";
import "./MesCommandes.css";

const statutConfig = {
    en_attente:   { label: "En attente",   color: "#856404", bg: "#fff3cd", icon: <FaClock /> },
    en_livraison: { label: "En livraison", color: "#0c5460", bg: "#d1ecf1", icon: <FaTruck /> },
    livree:       { label: "Livrée",       color: "#155724", bg: "#d4edda", icon: <FaCheckCircle /> },
    annulee:      { label: "Annulée",      color: "#721c24", bg: "#f8d7da", icon: <FaTimes /> },
};

const MesCommandes = ({ user }) => {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [lignes, setLignes] = useState([]);

    useEffect(() => {
        if (user?.idutilisateur) fetchCommandes();
    }, [user]);

    const fetchCommandes = async () => {
        const data = await getCommandesClient(user.idutilisateur);
        setCommandes(data);
        setLoading(false);
    };

    const fetchLignes = async (idcom) => {
        const data = await getLignesCommande(idcom);
        setLignes(data);
    };

    const handleSelect = (cmd) => {
        setSelected(cmd);
        fetchLignes(cmd.idcom);
    };

    if (loading) return <p className="mc-empty">Chargement...</p>;

    return (
        <div className="mes-commandes">
            <h2 className="mc-title">Mes commandes</h2>

            {commandes.length === 0 && (
                <p className="mc-empty">Aucune commande pour le moment.</p>
            )}

            <div className="mc-list">
                {commandes.map((cmd) => {
                    const statut = statutConfig[cmd.statutcom] || { label: cmd.statutcom, color: "#333", bg: "#eee", icon: <FaShoppingBag /> };
                    return (
                        <div key={cmd.idcom} className="mc-card" onClick={() => handleSelect(cmd)}>
                            <div className="mc-card-header">
                                <span className="mc-id">
                                    <FaShoppingBag style={{ marginRight: 6 }} />
                                    Commande #{cmd.idcom}
                                </span>
                                <span className="mc-badge" style={{ color: statut.color, background: statut.bg }}>
                                    {statut.icon} {statut.label}
                                </span>
                            </div>
                            <div className="mc-card-body">
                                <p className="mc-info">
                                    <FaCalendarAlt style={{ marginRight: 6 }} />
                                    {new Date(cmd.datecom).toLocaleString("fr-FR", {
                                        day: "numeric", month: "long", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                    })}
                                </p>
                                <p className="mc-total">{cmd.prixtotal} DA</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL DÉTAIL */}
            {selected && (
                <div className="mc-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="mc-modal" onClick={e => e.stopPropagation()}>
                        <div className="mc-modal-header">
                            <h3>Commande #{selected.idcom}</h3>
                            <button className="mc-modal-close" onClick={() => setSelected(null)}>✕</button>
                        </div>

                        <div className="mc-modal-body">
                            {lignes.length === 0 && <p className="mc-empty">Aucun plat.</p>}
                            {lignes.map((l) => (
                                <div key={l.idlignecom} className="mc-ligne">
                                    <span className="mc-ligne-nom">{l.plat?.nomplat}</span>
                                    <span className="mc-ligne-qty">x{l.quantitecom}</span>
                                    <span className="mc-ligne-prix">{l.prixunitaire * l.quantitecom} DA</span>
                                </div>
                            ))}
                        </div>

                        <div className="mc-modal-footer">
                            <span>Total</span>
                            <strong>{selected.prixtotal} DA</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MesCommandes;