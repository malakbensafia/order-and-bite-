import { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./ReservationsClient.css";

const ReservationsClient = ({ user: userProp }) => {
    const { user: userAuth } = useAuth();
    const user = userProp || userAuth;
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = async () => {
        if (!user?.idutilisateur) return;

        const { data } = await supabase
            .from("reservation")
            .select("*, tablerest(numtable, emplacement, capacitetable)")
            .eq("idclient", user.idutilisateur)
            .order("datereservation", { ascending: false });

        setReservations(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchReservations();
    }, [user]);

    const annulerReservation = async (idreservation) => {
        const ok = window.confirm("Annuler cette réservation ?");
        if (!ok) return;

        await supabase
            .from("reservation")
            .update({ statutres: "annulee" })
            .eq("idreservation", idreservation);

        fetchReservations();
    };

    const formatDate = (ds) => {
        if (!ds) return "";
        const d = new Date(ds);
        return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    };

    const badgeColor = {
        confirmee: { bg: "#d4edda", color: "#155724" },
        annulee:   { bg: "#f8d7da", color: "#721c24" },
        en_attente: { bg: "#fff3cd", color: "#856404" },
    };

    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

    return (
        <div className="resa-client-page">
            <h2 className="resa-client-title">Mes réservations</h2>

            {reservations.length === 0 && (
                <p className="resa-client-empty">Aucune réservation pour le moment.</p>
            )}

            <div className="resa-client-list">
                {reservations.map((r) => {
                    const badge = badgeColor[r.statutres] || { bg: "#eee", color: "#333" };
                    const isPast = new Date(r.datereservation + "T23:59:59") < new Date();
                    return (
                        <div key={r.idreservation} className="resa-client-card">
                            <div className="resa-client-header">
                                <div>
                                    <span className="resa-client-table">
                                        Table {r.tablerest?.numtable} — {r.tablerest?.emplacement}
                                    </span>
                                    <span className="resa-client-capacite">
                                        {r.tablerest?.capacitetable} personnes
                                    </span>
                                </div>
                                <span style={{
                                    background: badge.bg, color: badge.color,
                                    padding: "3px 12px", borderRadius: 100,
                                    fontSize: 12, fontWeight: 600
                                }}>
                                    {r.statutres}
                                </span>
                            </div>

                            <div className="resa-client-info">
                                <span> {formatDate(r.datereservation)}</span>
                                <span> {r.heureres?.slice(0, 5)}</span>
                                <span> {r.nbrpersonnes} personnes</span>
                            </div>

                            {r.statutres === "confirmee" && !isPast && (
                                <button
                                    className="resa-client-annuler"
                                    onClick={() => annulerReservation(r.idreservation)}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReservationsClient;