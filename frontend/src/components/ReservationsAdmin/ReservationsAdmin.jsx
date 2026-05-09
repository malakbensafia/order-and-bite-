import { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import "./ReservationsAdmin.css";

const ReservationsAdmin = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtre, setFiltre] = useState("toutes");

    const fetchReservations = async () => {
        const { data } = await supabase
            .from("reservation")
            .select("*, tablerest(numtable, emplacement, capacitetable)")
            .order("datereservation", { ascending: false });

        if (!data) { setLoading(false); return; }

        // Enrichir avec info client
        const enriched = await Promise.all(data.map(async (r) => {
            const { data: u } = await supabase
                .from("utilisateur")
                .select("nom, prenom, telephone")
                .eq("idutilisateur", r.idclient)
                .single();
            return { ...r, client: u };
        }));

        setReservations(enriched);
        setLoading(false);
    };

    useEffect(() => {
        fetchReservations();

        const channel = supabase
            .channel("reservations-admin")
            .on("postgres_changes", { event: "*", schema: "public", table: "reservation" }, fetchReservations)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const changerStatut = async (idreservation, statut) => {
        await supabase
            .from("reservation")
            .update({ statutres: statut })
            .eq("idreservation", idreservation);
        fetchReservations();
    };

    const formatDate = (ds) => {
        if (!ds) return "";
        const d = new Date(ds);
        return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    };

    const badgeColor = {
        confirmee:  { bg: "#d4edda", color: "#155724" },
        annulee:    { bg: "#f8d7da", color: "#721c24" },
        en_attente: { bg: "#fff3cd", color: "#856404" },
    };

    const filtrees = reservations.filter(r => {
        if (filtre === "toutes") return true;
        return r.statutres === filtre;
    });

    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

    return (
        <div className="resa-admin-page">
            <h2 className="resa-admin-title">Réservations ({reservations.length})</h2>

            {/* FILTRES */}
            <div className="resa-admin-filtres">
                {["toutes", "confirmee", "annulee", "en_attente"].map(f => (
                    <button
                        key={f}
                        className={`resa-filtre-btn ${filtre === f ? "active" : ""}`}
                        onClick={() => setFiltre(f)}
                    >
                        {f === "toutes" ? "Toutes" : f.replace("_", " ")}
                    </button>
                ))}
            </div>

            {filtrees.length === 0 && (
                <p className="resa-admin-empty">Aucune réservation.</p>
            )}

            <div className="resa-admin-list">
                {filtrees.map((r) => {
                    const badge = badgeColor[r.statutres] || { bg: "#eee", color: "#333" };
                    return (
                        <div key={r.idreservation} className="resa-admin-card">
                            <div className="resa-admin-header">
                                <div>
                                    <span className="resa-admin-id">Réservation #{r.idreservation}</span>
                                    <span className="resa-admin-date">{formatDate(r.datereservation)} à {r.heureres?.slice(0, 5)}</span>
                                </div>
                                <span style={{
                                    background: badge.bg, color: badge.color,
                                    padding: "3px 12px", borderRadius: 100,
                                    fontSize: 12, fontWeight: 600
                                }}>
                                    {r.statutres}
                                </span>
                            </div>

                            <div className="resa-admin-body">
                                <div className="resa-admin-section">
                                    <p className="resa-section-label">Client</p>
                                    <p>{r.client?.prenom} {r.client?.nom} — {r.client?.telephone}</p>
                                </div>
                                <div className="resa-admin-section">
                                    <p className="resa-section-label">Table</p>
                                    <p>Table {r.tablerest?.numtable} — {r.tablerest?.emplacement} — {r.tablerest?.capacitetable} personnes</p>
                                </div>
                                <div className="resa-admin-section">
                                    <p className="resa-section-label">Personnes</p>
                                    <p>{r.nbrpersonnes} personnes</p>
                                </div>
                            </div>

                            <div className="resa-admin-actions">
                                {r.statutres !== "confirmee" && (
                                    <button className="btn-confirmer-resa" onClick={() => changerStatut(r.idreservation, "confirmee")}>
                                        Confirmer
                                    </button>
                                )}
                                {r.statutres !== "annulee" && (
                                    <button className="btn-annuler-resa" onClick={() => changerStatut(r.idreservation, "annulee")}>
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReservationsAdmin;