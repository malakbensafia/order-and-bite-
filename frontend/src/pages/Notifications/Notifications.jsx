import React, { useState, useEffect } from "react";
import supabase from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Notifications.css";
import { FaBell, FaCheck } from "react-icons/fa";

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // CHARGER NOTIFICATIONS
    const fetchNotifications = async () => {
        if (!user?.idutilisateur) return;

        const { data } = await supabase
            .from("notification")
            .select("*")
            .eq("idutilisateur", user.idutilisateur)
            .order("datecreationnotif", { ascending: false });

        setNotifications(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();

        // REALTIME — nouvelle notif apparaît automatiquement
        const channel = supabase
            .channel("notif-realtime")
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "notification",
                filter: `idutilisateur=eq.${user?.idutilisateur}`
            }, fetchNotifications)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user]);

    // MARQUER COMME LUE
    const marquerLue = async (idnotif) => {
        await supabase
            .from("notification")
            .update({ isread: true })
            .eq("idnotif", idnotif);

        fetchNotifications();
    };

    // MARQUER TOUTES COMME LUES
    const marquerToutesLues = async () => {
        await supabase
            .from("notification")
            .update({ isread: true })
            .eq("idutilisateur", user.idutilisateur);

        fetchNotifications();
    };

    const nonLues = notifications.filter(n => !n.isread).length;

    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

    return (
        <div className="notifications-page">
            <div className="notif-header">
                <h2><FaBell /> Notifications {nonLues > 0 && <span className="notif-count">{nonLues}</span>}</h2>
                {nonLues > 0 && (
                    <button className="btn-tout-lire" onClick={marquerToutesLues}>
                        <FaCheck /> Tout marquer comme lu
                    </button>
                )}
            </div>

            {notifications.length === 0 && (
                <p className="notif-empty">Aucune notification pour le moment</p>
            )}

            <div className="notif-list">
                {notifications.map((n) => (
                    <div
                        key={n.idnotif}
                        className={`notif-item ${n.isread ? "lue" : "non-lue"}`}
                    >
                        <div className="notif-content">
                            <p className="notif-message">{n.message}</p>
                            <small className="notif-date">
                                {new Date(n.datecreationnotif).toLocaleString("fr")}
                            </small>
                        </div>
                        {!n.isread && (
                            <button
                                className="btn-lire"
                                onClick={() => marquerLue(n.idnotif)}
                            >
                                <FaCheck />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;