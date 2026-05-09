import React, { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { FaMapMarkerAlt, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import "./LivreesLivreur.css";

const LivreesLivreur = () => {
    const { user } = useAuth();
    const [livraisons, setLivraisons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLivrees();
    }, []);

    const fetchLivrees = async () => {
        const { data } = await supabase
            .from("livraison")
            .select("*, adresse(*), commande(*)")
            .eq("idlivreur", user.idutilisateur)
            .eq("statutlivraison", "livree")
            .order("datelivraison", { ascending: false });

        setLivraisons(data || []);
        setLoading(false);
    };

    return (
        <div className="livrees-livreur">
            <h2 className="livrees-title">Livraisons livrées</h2>

            {loading && <p className="livrees-empty">Chargement...</p>}

            {!loading && livraisons.length === 0 && (
                <p className="livrees-empty">Aucune livraison livrée pour le moment.</p>
            )}

            <div className="livrees-list">
                {livraisons.map((liv) => (
                    <div key={liv.idlivraison} className="livree-card">

                        <div className="livree-header">
                            <span className="livree-id">Commande #{liv.idcom}</span>
                            <span className="livree-badge">
                                <FaCheckCircle /> Livrée
                            </span>
                        </div>

                        <div className="livree-body">
                            <p className="livree-info">
                                <FaCalendarAlt style={{ marginRight: 6 }} />
                                {liv.datelivraison
                                    ? new Date(liv.datelivraison).toLocaleString("fr")
                                    : "Date inconnue"}
                            </p>

                            {liv.adresse ? (
                                <p className="livree-info">
                                    <FaMapMarkerAlt style={{ marginRight: 6 }} />
                                    {liv.adresse.rue}, {liv.adresse.ville}
                                </p>
                            ) : (
                                <p className="livree-info">Adresse non disponible</p>
                            )}
                        </div>

                        <div className="livree-footer">
                            <span className="livree-total">
                                {liv.commande?.prixtotal} DA
                            </span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default LivreesLivreur;