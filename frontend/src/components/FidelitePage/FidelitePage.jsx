import React, { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import "./FidelitePage.css";

const FidelitePage = () => {

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        const { data } = await supabase
            .from("client")
            .select(`
                pointfidelite,
                utilisateur(idutilisateur, nom, prenom, email, telephone)
            `)
            .order("pointfidelite", { ascending: false });

        setClients(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const voirHistorique = async (client) => {
        setSelectedClient(client);
        const { data } = await supabase
            .from("historiquepoint")
            .select("*")
            .eq("idclient", client.utilisateur.idutilisateur)
            .order("datehist", { ascending: false });
        setHistorique(data || []);
    };

    const fermerHistorique = () => {
        setSelectedClient(null);
        setHistorique([]);
    };

    const labelType = (type) => {
        switch (type) {
            case "commande_livree": return "Commande livrée";
            case "avis_laisse": return "Avis laissé";
            case "bonus_depenses": return "Bonus 10 000 DA";
            case "utilisation": return "Points utilisés";
            default: return type;
        }
    };

    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

    return (
        <div className="fidelite-page">
            <h2 className="fidelite-title">
                <i className="ti ti-star" aria-hidden="true" /> Programme de fidélité
            </h2>

            {/* RÈGLES */}
            <div className="fidelite-regles">
                <h3>Règles du programme</h3>
                <div className="regles-grid">
                    <div className="regle-card">
                        <i className="ti ti-truck-delivery" style={{ fontSize: 24 }} aria-hidden="true" />
                        <p>Commande livrée</p>
                        <strong>+10 pts</strong>
                    </div>
                    <div className="regle-card">
                        <i className="ti ti-star" style={{ fontSize: 24 }} aria-hidden="true" />
                        <p>Avis laissé</p>
                        <strong>+20 pts</strong>
                    </div>
                    <div className="regle-card">
                        <i className="ti ti-coin" style={{ fontSize: 24 }} aria-hidden="true" />
                        <p>10 000 DA dépensés</p>
                        <strong>+100 pts</strong>
                    </div>
                    <div className="regle-card">
                        <i className="ti ti-gift" style={{ fontSize: 24 }} aria-hidden="true" />
                        <p>100 pts</p>
                        <strong>= 10% réduction</strong>
                    </div>
                </div>
            </div>

            <hr />

            {/* LISTE CLIENTS */}
            <h3 className="fidelite-subtitle">Classement clients</h3>
            <div className="fidelite-list">
                {clients.length === 0 && <p className="fidelite-empty">Aucun client</p>}
                {clients.map((c, i) => (
                    <div key={c.utilisateur?.idutilisateur} className="fidelite-card">
                        <div className="fidelite-card-left">
                            <span className="fidelite-rank">#{i + 1}</span>
                            <i className="ti ti-user" style={{ fontSize: 20 }} aria-hidden="true" />
                            <div>
                                <p className="fidelite-nom">
                                    {c.utilisateur?.prenom} {c.utilisateur?.nom}
                                </p>
                                <small className="fidelite-email">{c.utilisateur?.email}</small>
                            </div>
                        </div>
                        <div className="fidelite-card-right">
                            <span className="fidelite-points">
                                <i className="ti ti-star" style={{ color: "#f5a623" }} aria-hidden="true" /> {c.pointfidelite} pts
                            </span>
                            <button className="btn-historique" onClick={() => voirHistorique(c)}>
                                <i className="ti ti-history" aria-hidden="true" /> Historique
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL HISTORIQUE */}
            {selectedClient && (
                <div className="modal-overlay" onClick={fermerHistorique}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>
                            Historique — {selectedClient.utilisateur?.prenom} {selectedClient.utilisateur?.nom}
                        </h3>
                        <p className="historique-points-total">
                            <i className="ti ti-star" style={{ color: "#f5a623" }} aria-hidden="true" /> Total : <strong>{selectedClient.pointfidelite} pts</strong>
                        </p>

                        <div className="historique-list">
                            {historique.length === 0 && (
                                <p className="historique-empty">Aucun historique</p>
                            )}
                            {historique.map((h) => (
                                <div key={h.idhistorique} className="historique-item">
                                    <div>
                                        <p className="historique-type">{labelType(h.typehist)}</p>
                                        <small className="historique-date">
                                            {new Date(h.datehist).toLocaleString("fr")}
                                        </small>
                                    </div>
                                    <span className={`historique-valeur ${h.valhist > 0 ? "positif" : "negatif"}`}>
                                        {h.valhist > 0 ? "+" : ""}{h.valhist} pts
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="btn-fermer" onClick={fermerHistorique}>Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FidelitePage;