import { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import {
    FaUser, FaEnvelope, FaPhone, FaShoppingBag,
    FaTruck, FaUsers, FaMoneyBillWave, FaCalendar, FaHamburger
} from "react-icons/fa";
import "./ProfilAdmin.css";

const ProfilAdmin = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        commandes: 0,
        ca: 0,
        clients: 0,
        livreurs: 0,
        livraisonsEnCours: 0,
        reservations: 0,
        plats: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [
                { count: commandes },
                { data: paiements },
                { count: clients },
                { count: livreurs },
                { count: livraisonsEnCours },
                { count: reservations },
                { count: plats },
            ] = await Promise.all([
                supabase.from("commande").select("*", { count: "exact", head: true }),
                supabase.from("paiement").select("montantpaiement"),
                supabase.from("client").select("*", { count: "exact", head: true }),
                supabase.from("livreur").select("*", { count: "exact", head: true }),
                supabase.from("livraison").select("*", { count: "exact", head: true }).eq("statutlivraison", "en_livraison"),
                supabase.from("reservation").select("*", { count: "exact", head: true }),
                supabase.from("plat").select("*", { count: "exact", head: true }).eq("disponibilite", true),
            ]);

            const ca = (paiements || []).reduce((sum, p) => sum + (p.montantpaiement || 0), 0);

            setStats({
                commandes: commandes || 0,
                ca,
                clients: clients || 0,
                livreurs: livreurs || 0,
                livraisonsEnCours: livraisonsEnCours || 0,
                reservations: reservations || 0,
                plats: plats || 0,
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: "Commandes totales", value: stats.commandes, icon: <FaShoppingBag />, color: "#3E2C23" },
        { label: "Chiffre d'affaires", value: `${stats.ca.toLocaleString()} DA`, icon: <FaMoneyBillWave />, color: "#2d6a4f" },
        { label: "Clients", value: stats.clients, icon: <FaUsers />, color: "#0c5460" },
        { label: "Livreurs", value: stats.livreurs, icon: <FaTruck />, color: "#4a1d96" },
        { label: "Livraisons en cours", value: stats.livraisonsEnCours, icon: <FaTruck />, color: "#856404" },
        { label: "Réservations", value: stats.reservations, icon: <FaCalendar />, color: "#721c24" },
        { label: "Plats disponibles", value: stats.plats, icon: <FaHamburger />, color: "#155724" },
    ];

    return (
        <div className="profil-admin-page">

            {/* CARTE PROFIL */}
            <div className="profil-admin-card">
                <div className="profil-admin-avatar">
                    <FaUser />
                </div>
                <div className="profil-admin-info">
                    <h2>{user?.prenom} {user?.nom}</h2>
                    <span className="profil-admin-role">Administrateur</span>
                    <div className="profil-admin-details">
                        <div className="profil-detail-row">
                            <FaEnvelope />
                            <span>{user?.email || "—"}</span>
                        </div>
                        <div className="profil-detail-row">
                            <FaPhone />
                            <span>{user?.telephone || "—"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <h3 className="profil-admin-stats-title">Statistiques du restaurant</h3>

            {loading ? (
                <p style={{ color: "#aaa", fontSize: 14 }}>Chargement des statistiques...</p>
            ) : (
                <div className="profil-admin-stats">
                    {statCards.map((s, i) => (
                        <div key={i} className="profil-stat-card">
                            <div className="profil-stat-icon" style={{ background: s.color }}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="profil-stat-label">{s.label}</p>
                                <p className="profil-stat-value">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilAdmin;