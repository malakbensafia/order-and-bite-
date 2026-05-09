import { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import "./CommandesPage.css";

const CommandesPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [showLivreurs, setShowLivreurs] = useState(false);

  const fetchCommandes = async () => {
    const { data: cmds, error } = await supabase
      .from("commande")
      .select("*")
      .order("datecom", { ascending: false });

    if (error) { console.error("commande error:", error); setLoading(false); return; }
    if (!cmds || cmds.length === 0) { setCommandes([]); setLoading(false); return; }

    const enriched = await Promise.all(cmds.map(async (cmd) => {

      let clientInfo = null;
      if (cmd.idclient) {
        const { data: u } = await supabase
          .from("utilisateur")
          .select("nom, prenom, telephone")
          .eq("idutilisateur", cmd.idclient)
          .single();
        clientInfo = u;
      }

      const { data: lignes } = await supabase
        .from("lignecommande")
        .select("quantitecom, prixunitaire, idplat")
        .eq("idcom", cmd.idcom);

      const lignesAvecPlat = await Promise.all((lignes || []).map(async (l) => {
        const { data: plat } = await supabase
          .from("plat")
          .select("nomplat")
          .eq("idplat", l.idplat)
          .single();
        return { ...l, plat };
      }));

      const { data: livraisons } = await supabase
        .from("livraison")
        .select("*")
        .eq("idcom", cmd.idcom);

      const { data: paiements } = await supabase
        .from("paiement")
        .select("*")
        .eq("idcom", cmd.idcom);

      return {
        ...cmd,
        clientInfo,
        lignecommande: lignesAvecPlat,
        livraison: livraisons || [],
        paiement: paiements || [],
      };
    }));

    setCommandes(enriched);
    setLoading(false);
  };

  const fetchLivreurs = async () => {
    const { data: livs } = await supabase
      .from("livreur")
      .select("idutilisateur, zonelivraison, statutlivreur");

    if (!livs) return;

    const enriched = await Promise.all(livs.map(async (l) => {
      const { data: u } = await supabase
        .from("utilisateur")
        .select("nom, prenom, telephone")
        .eq("idutilisateur", l.idutilisateur)
        .single();
      return { ...l, utilisateur: u };
    }));

    setLivreurs(enriched);
  };

  useEffect(() => {
    fetchCommandes();
    fetchLivreurs();

    const channel = supabase
      .channel("commandes-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "commande" }, fetchCommandes)
      .on("postgres_changes", { event: "*", schema: "public", table: "livraison" }, fetchCommandes)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const accepterCommande = async (commande) => {
    await supabase.from("commande").update({ statutcom: "acceptee" }).eq("idcom", commande.idcom);
    await supabase.from("notification").insert({
      message: `Votre commande #${commande.idcom} a été acceptée par le restaurant.`,
      isread: false,
      datecreationnotif: new Date().toISOString(),
      idutilisateur: commande.idclient,
    });
    setSelectedCommande(commande);
    setShowLivreurs(true);
    fetchCommandes();
  };

  const refuserCommande = async (commande) => {
    await supabase.from("commande").update({ statutcom: "refusee" }).eq("idcom", commande.idcom);
    await supabase.from("notification").insert({
      message: `Votre commande #${commande.idcom} a été refusée.`,
      isread: false,
      datecreationnotif: new Date().toISOString(),
      idutilisateur: commande.idclient,
    });
    fetchCommandes();
  };

  const notifierLivreurs = async (commande) => {
    const dispos = livreurs.filter((l) => l.statutlivreur === "disponible");
    if (dispos.length === 0) { alert("Aucun livreur disponible."); return; }

    //  juste notifier, PAS d'insert dans livraison
    await supabase.from("notification").insert(
      dispos.map((l) => ({
        message: `Nouvelle commande #${commande.idcom} — ${commande.prixtotal} DA. Acceptez-la dans votre app.`,
        isread: false,
        datecreationnotif: new Date().toISOString(),
        idutilisateur: l.idutilisateur,
      }))
    );

    await supabase.from("commande")
      .update({ statutcom: "en_attente_livreur" })
      .eq("idcom", commande.idcom);

    alert(`Notification envoyée à ${dispos.length} livreur(s) !`);
    setShowLivreurs(false);
    setSelectedCommande(null);
    fetchCommandes();
  };

  const assignerLivreur = async (commande, livreur) => {

    const { data: adresse } = await supabase
      .from("adresse")
      .select("idadrs")
      .eq("idclient", commande.idclient)
      .order("idadrs", { ascending: false })
      .limit(1)
      .maybeSingle();

    
    await supabase.from("livraison").insert({
      datelivraison: null,
      statutlivraison: "proposee",
      idcom: commande.idcom,
      idlivreur: livreur.idutilisateur,
      idadrs: adresse?.idadrs || null,
    });

    // Commande en attente que le livreur accepte
    await supabase.from("commande")
      .update({ statutcom: "en_attente_livreur" })
      .eq("idcom", commande.idcom);

    // Notif au livreur
    await supabase.from("notification").insert({
      message: `L'admin vous a assigné la commande #${commande.idcom} — ${commande.prixtotal} DA. Acceptez-la dans votre app.`,
      isread: false,
      datecreationnotif: new Date().toISOString(),
      idutilisateur: livreur.idutilisateur,
    });

    alert(`Commande proposée à ${livreur.utilisateur?.prenom} — en attente de son acceptation.`);
    setShowLivreurs(false);
    setSelectedCommande(null);
    fetchCommandes();
    fetchLivreurs();
  };

  const badgeStyle = {
    "en_attente": { bg: "#fff3cd", color: "#856404" },
    "en attente": { bg: "#fff3cd", color: "#856404" }, // 👈 AJOUTÉ
    "acceptee": { bg: "#d1ecf1", color: "#0c5460" },
    "refusee": { bg: "#f8d7da", color: "#721c24" },
    "en_attente_livreur": { bg: "#e2d9f3", color: "#4a1d96" },
    "en_livraison": { bg: "#d4edda", color: "#155724" },
    "livree": { bg: "#c8e6c9", color: "#1b5e20" },
  };

  const StatutBadge = ({ statut }) => {
    const s = badgeStyle[statut] || { bg: "#eee", color: "#333" };
    return (
      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
        {statut?.replace(/_/g, " ") || "inconnu"}
      </span>
    );
  };

  if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;

  return (
    <div className="commandes-page">
      <h2 className="commandes-title">Commandes ({commandes.length})</h2>

      {commandes.length === 0 && <p className="commandes-empty">Aucune commande pour le moment.</p>}

      <div className="commandes-list">
        {commandes.map((cmd) => (
          <div key={cmd.idcom} className="commande-card">

            <div className="commande-header">
              <div>
                <span className="commande-id">Commande #{cmd.idcom}</span>
                <span className="commande-date">
                  {cmd.datecom ? new Date(cmd.datecom).toLocaleString("fr") : "—"}
                </span>
              </div>
              <StatutBadge statut={cmd.statutcom} />
            </div>

            <div className="commande-section">
              <p className="section-label">Client</p>
              <p>{cmd.clientInfo ? `${cmd.clientInfo.prenom} ${cmd.clientInfo.nom} — ${cmd.clientInfo.telephone}` : `ID: ${cmd.idclient}`}</p>
            </div>

            <div className="commande-section">
              <p className="section-label">Plats commandés</p>
              {cmd.lignecommande?.length > 0
                ? cmd.lignecommande.map((l, i) => (
                  <p key={i} className="commande-plat-line">
                    {l.quantitecom}× {l.plat?.nomplat || "Plat inconnu"}
                    <span className="commande-plat-prix">{l.prixunitaire * l.quantitecom} DA</span>
                  </p>
                ))
                : <p style={{ color: "#aaa", fontSize: 13 }}>Aucun plat</p>
              }
            </div>

            <div className="commande-footer">
              <span className="commande-total">Total : {cmd.prixtotal} DA</span>
              {cmd.paiement?.[0] && (
                <span className="commande-paiement">Paiement : {cmd.paiement[0].statutpaiement}</span>
              )}
              {cmd.livraison?.[0] && (
                <span className="commande-livraison-statut">
                  Livraison : {cmd.livraison[0].statutlivraison?.replace(/_/g, " ")}
                </span>
              )}
            </div>

            {/*  MODIFIÉ — accepte aussi "en attente" avec espace et null */}
            <div className="commande-actions">
              {(cmd.statutcom === "en_attente" || cmd.statutcom === "en attente" || !cmd.statutcom) && (
                <>
                  <button className="btn-accepter" onClick={() => accepterCommande(cmd)}>Accepter</button>
                  <button className="btn-refuser" onClick={() => refuserCommande(cmd)}>Refuser</button>
                </>
              )}
              {cmd.statutcom === "acceptee" && (
                <button className="btn-livreurs" onClick={() => { setSelectedCommande(cmd); setShowLivreurs(true); }}>
                  Assigner un livreur
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {showLivreurs && selectedCommande && (
        <div className="modal-overlay" onClick={() => setShowLivreurs(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Commande #{selectedCommande.idcom} — Choisir un livreur</h3>

            <button className="btn-notif-all" onClick={() => notifierLivreurs(selectedCommande)}>
              Notifier tous les livreurs disponibles
            </button>

            <p className="modal-ou">— ou assigner manuellement —</p>

            <div className="livreurs-list">
              {livreurs.map((l) => {
                const dispo = l.statutlivreur === "disponible";
                return (
                  <div key={l.idutilisateur} className={`livreur-row ${dispo ? "dispo" : "indispo"}`}>
                    <div>
                      <p className="livreur-nom">{l.utilisateur?.prenom} {l.utilisateur?.nom}</p>
                      <p className="livreur-zone">{l.zonelivraison}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={`livreur-badge ${dispo ? "badge-dispo" : "badge-indispo"}`}>
                        {dispo ? "Disponible" : "Indisponible"}
                      </span>
                      {dispo && (
                        <button className="btn-assigner" onClick={() => assignerLivreur(selectedCommande, l)}>
                          Assigner
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="btn-fermer" onClick={() => setShowLivreurs(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesPage;