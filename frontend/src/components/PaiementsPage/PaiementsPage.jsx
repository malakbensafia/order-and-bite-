import { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import "./PaiementsPage.css";
import { FaTruck, FaCalendar } from "react-icons/fa";
const PaiementsPage = () => {
    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtre, setFiltre] = useState("tous");

    const fetchPaiements = async () => {
        // Paiements livraison (liés à une commande)
        const { data: paiementsCommande } = await supabase
            .from("paiement")
            .select("*")
            .not("idcom", "is", null)
            .order("datepaiement", { ascending: false });

        // enrichir avec info client via commande
        const commandeEnriched = await Promise.all((paiementsCommande || []).map(async (p) => {
            const { data: cmd } = await supabase
                .from("commande")
                .select("idclient, datecom, prixtotal")
                .eq("idcom", p.idcom)
                .single();

            let client = null;
            if (cmd?.idclient) {
                const { data: u } = await supabase
                    .from("utilisateur")
                    .select("nom, prenom")
                    .eq("idutilisateur", cmd.idclient)
                    .single();
                client = u;
            }

            return { ...p, type: "livraison", commande: cmd, client };
        }));

        // Paiements réservation (liés à une réservation)
        const { data: paiementsReservation } = await supabase
            .from("paiement")
            .select("*")
            .not("idreservation", "is", null)
            .order("datepaiement", { ascending: false });

        // Enrichir avec info client via réservation
        const reservationEnriched = await Promise.all((paiementsReservation || []).map(async (p) => {
            const { data: resa } = await supabase
                .from("reservation")
                .select("idclient, datereservation, heureres")
                .eq("idreservation", p.idreservation)
                .single();

            let client = null;
            if (resa?.idclient) {
                const { data: u } = await supabase
                    .from("utilisateur")
                    .select("nom, prenom")
                    .eq("idutilisateur", resa.idclient)
                    .single();
                client = u;
            }

            return { ...p, type: "reservation", reservation: resa, client };
        }));

        // Fusionner et trier par date
        const tous = [...commandeEnriched, ...reservationEnriched].sort(
            (a, b) => new Date(b.datepaiement) - new Date(a.datepaiement)
        );

        setPaiements(tous);
        setLoading(false);
    };

    useEffect(() => {
        fetchPaiements();
    }, []);

    const formatDate = (ds) => {
        if (!ds) return "—";
        return new Date(ds).toLocaleString("fr-FR", {
            day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const badgeStatut = {
        paye:    { bg: "#d4edda", color: "#155724" },
        gratuit: { bg: "#e2e3e5", color: "#383d41" },
        echec:   { bg: "#f8d7da", color: "#721c24" },
        en_attente: { bg: "#fff3cd", color: "#856404" },
    };

    const filtres = [
        { key: "tous", label: "Tous" },
        { key: "livraison", label: "Livraisons" },
        { key: "reservation", label: "Réservations" },
    ];

    const filtrees = paiements.filter(p => filtre === "tous" || p.type === filtre);

    const totalCA = filtrees.reduce((sum, p) => sum + (p.montantpaiement || 0), 0);

    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

    return (
        <div className="paiements-page">
            <h2 className="paiements-title">Paiements</h2>

            {/* STATS */}
            <div className="paiements-stats">
                <div className="stat-card">
                    <p className="stat-label">Total paiements</p>
                    <p className="stat-value">{paiements.length}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">CA affiché</p>
                    <p className="stat-value">{totalCA.toLocaleString()} DA</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Livraisons</p>
                    <p className="stat-value">{paiements.filter(p => p.type === "livraison").length}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Réservations</p>
                    <p className="stat-value">{paiements.filter(p => p.type === "reservation").length}</p>
                </div>
            </div>

            {/* FILTRES */}
            <div className="paiements-filtres">
                {filtres.map(f => (
                    <button
                        key={f.key}
                        className={`filtre-btn ${filtre === f.key ? "active" : ""}`}
                        onClick={() => setFiltre(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filtrees.length === 0 && (
                <p className="paiements-empty">Aucun paiement.</p>
            )}

            {/* LISTE */}
            <div className="paiements-list">
                {filtrees.map((p) => {
                    const badge = badgeStatut[p.statutpaiement] || { bg: "#eee", color: "#333" };
                    return (
                        <div key={p.idpaiement} className="paiement-card">
                            <div className="paiement-header">
                                <div>
                                    <span className="paiement-id">Paiement #{p.idpaiement}</span>
                                    <span className={`paiement-type ${p.type}`}>
                                       {p.type === "livraison" ? <><FaTruck style={{marginRight:5}}/> Livraison</> : <><FaCalendar style={{marginRight:5}}/> Réservation</>}
                                    </span>
                                </div>
                                <span style={{
                                    background: badge.bg, color: badge.color,
                                    padding: "3px 12px", borderRadius: 100,
                                    fontSize: 12, fontWeight: 600
                                }}>
                                    {p.statutpaiement}
                                </span>
                            </div>

                            <div className="paiement-body">
                                <div className="paiement-section">
                                    <p className="section-label">Client</p>
                                    <p>{p.client ? `${p.client.prenom} ${p.client.nom}` : "—"}</p>
                                </div>

                                {p.type === "livraison" && (
                                    <div className="paiement-section">
                                        <p className="section-label">Commande</p>
                                        <p>#{p.idcom} — {formatDate(p.commande?.datecom)}</p>
                                    </div>
                                )}

                                {p.type === "reservation" && (
                                    <div className="paiement-section">
                                        <p className="section-label">Réservation</p>
                                        <p>#{p.idreservation} — {p.reservation?.datereservation} à {p.reservation?.heureres?.slice(0,5)}</p>
                                    </div>
                                )}

                                <div className="paiement-section">
                                    <p className="section-label">Date paiement</p>
                                    <p>{formatDate(p.datepaiement)}</p>
                                </div>

                                <div className="paiement-section">
                                    <p className="section-label">Montant</p>
                                    <p className="paiement-montant">{p.montantpaiement} DA</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaiementsPage;