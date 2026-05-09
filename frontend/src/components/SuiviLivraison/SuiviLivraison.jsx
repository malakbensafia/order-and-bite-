import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./SuiviLivraison.css";
import {
  FaReceipt, FaUtensils, FaSearch,
  FaMotorcycle, FaCheckCircle, FaClock
} from "react-icons/fa";

const ETAPES = [
  { key: "en_attente",         label: "Commande reçue",   icon: <FaReceipt /> },
  { key: "acceptee",           label: "Préparation",       icon: <FaUtensils /> },
  { key: "en_attente_livreur", label: "Recherche livreur", icon: <FaSearch /> },
  { key: "en_livraison",       label: "En livraison",      icon: <FaMotorcycle /> },
  { key: "livree",             label: "Livrée",            icon: <FaCheckCircle /> },
];

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const SuiviLivraison = () => {
  const { user } = useAuth();
  const [commande, setCommande] = useState(null);
  const [livreurPosition, setLivreurPosition] = useState(null);
  const [adresseClient, setAdresseClient] = useState(null);
  const [idLivreur, setIdLivreur] = useState(null);
  const [tempsRestant, setTempsRestant] = useState(null);
  const intervalRef = useRef(null);

  const fetchCommande = async () => {
    if (!user?.idutilisateur) return;

    const { data } = await supabase
      .from("commande")
      .select("*")
      .eq("idclient", user.idutilisateur)
      .in("statutcom", ["en_attente", "acceptee", "en_attente_livreur", "en_livraison"])
      .order("datecom", { ascending: false })
      .limit(1)
      .maybeSingle();

    setCommande(data);

    if (data) {
      const { data: adrs } = await supabase
        .from("adresse")
        .select("latitudeadrs, longitudeadrs, rue, ville")
        .eq("idclient", user.idutilisateur)
        .order("idadrs", { ascending: false })
        .limit(1)
        .maybeSingle();
      setAdresseClient(adrs);

      const { data: liv } = await supabase
        .from("livraison")
        .select("idlivreur")
        .eq("idcom", data.idcom)
        .maybeSingle();

      if (liv?.idlivreur) {
        setIdLivreur(liv.idlivreur);
        const { data: livreur } = await supabase
          .from("livreur")
          .select("latitudeliv, longitudeliv")
          .eq("idutilisateur", liv.idlivreur)
          .single();

        if (livreur?.latitudeliv) {
          setLivreurPosition({ lat: livreur.latitudeliv, lng: livreur.longitudeliv });
        }
      }
    }
  };

  const fetchPosition = async () => {
    if (!idLivreur) return;
    const { data } = await supabase
      .from("livreur")
      .select("latitudeliv, longitudeliv")
      .eq("idutilisateur", idLivreur)
      .single();

    if (data?.latitudeliv) {
      const pos = { lat: data.latitudeliv, lng: data.longitudeliv };
      setLivreurPosition(pos);

      if (adresseClient?.latitudeadrs) {
        const dist = distanceKm(pos.lat, pos.lng, adresseClient.latitudeadrs, adresseClient.longitudeadrs);
        const minutes = Math.round((dist / 30) * 60);
        setTempsRestant(minutes);
      }
    }
  };

  useEffect(() => { fetchCommande(); }, [user]);

  useEffect(() => {
    if (!idLivreur) return;
    intervalRef.current = setInterval(fetchPosition, 1000);
    return () => clearInterval(intervalRef.current);
  }, [idLivreur, adresseClient]);

  useEffect(() => {
    if (!commande?.idcom) return;
    const channel = supabase
      .channel("suivi-statut")
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "commande",
        filter: `idcom=eq.${commande.idcom}`
      }, (payload) => setCommande(prev => ({ ...prev, ...payload.new })))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [commande?.idcom]);

  if (!user) return <p style={{ padding: 20 }}>Connexion requise.</p>;

  if (!commande) return (
    <div style={{ padding: 20 }}>
      <h2>Suivi de livraison</h2>
      <p style={{ color: "#999", marginTop: 12 }}>Aucune livraison en cours.</p>
    </div>
  );

  const statutActuel = commande.statutcom;
  const indexActuel = ETAPES.findIndex(e => e.key === statutActuel);

  const mapUrl = livreurPosition
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${livreurPosition.lng - 0.01},${livreurPosition.lat - 0.01},${livreurPosition.lng + 0.01},${livreurPosition.lat + 0.01}&layer=mapnik&marker=${livreurPosition.lat},${livreurPosition.lng}`
    : null;

  return (
    <div className="suivi-page">
      <h2 className="suivi-title">Suivi de livraison</h2>

      <div className="suivi-info-bar">
        <span className="suivi-cmd-id">Commande #{commande.idcom}</span>
        <span className="suivi-total">{commande.prixtotal} DA</span>
        {tempsRestant !== null && statutActuel === "en_livraison" && (
          <span className="suivi-temps">
            <FaClock style={{ marginRight: 5 }} />
            Arrivée estimée : <strong>{tempsRestant < 1 ? "moins d'1 min" : `${tempsRestant} min`}</strong>
          </span>
        )}
      </div>

      <div className="suivi-stepper">
        {ETAPES.map((etape, idx) => {
          const done = idx < indexActuel;
          const active = idx === indexActuel;
          return (
            <React.Fragment key={etape.key}>
              <div className={`suivi-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                <div className="suivi-step-icon">
                  {done ? <FaCheckCircle /> : etape.icon}
                </div>
                <p className="suivi-step-label">{etape.label}</p>
              </div>
              {idx < ETAPES.length - 1 && (
                <div className={`suivi-step-line ${done ? "done" : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {statutActuel === "en_livraison" && (
        <>
          {mapUrl ? (
            <iframe
              key={`${livreurPosition.lat}-${livreurPosition.lng}`}
              src={mapUrl}
              width="100%"
              height="400"
              className="suivi-map"
              title="Position livreur"
            />
          ) : (
            <div className="suivi-map-placeholder">
              Position du livreur non disponible encore...
            </div>
          )}
          <p className="suivi-map-note">Position mise à jour toutes les secondes</p>
        </>
      )}

      {statutActuel === "livree" && (
        <div className="suivi-livree">
          <div className="suivi-livree-icon"><FaCheckCircle /></div>
          <h3>Commande livrée !</h3>
          <p>Merci pour votre commande. Bon appétit !</p>
        </div>
      )}
    </div>
  );
};

export default SuiviLivraison;