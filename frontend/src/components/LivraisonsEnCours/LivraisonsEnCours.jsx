import React, { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import './LivraisonsEnCours.css';
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { ajouterPoints } from "../../api/fideliteApi";

const distanceKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const LivraisonsEnCours = () => {
    const { user } = useAuth();
    const [livraisons, setLivraisons] = useState([]);
    const [procheIds, setProcheIds] = useState([]); // ids des livraisons où livreur est proche

    const fetchLivraisons = async () => {
        const { data } = await supabase
            .from("livraison")
            .select("*, adresse(*), commande(*)")
            .eq("idlivreur", user.idutilisateur)
            .eq("statutlivraison", "en_livraison");

        setLivraisons(data || []);
    };

    // Fetch + realtime
    useEffect(() => {
        fetchLivraisons();

        const channel = supabase
            .channel("livraisons-en-cours")
            .on("postgres_changes", {
                event: "*", schema: "public", table: "livraison"
            }, fetchLivraisons)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // GPS — envoie position + détecte proximité
    useEffect(() => {
        if (!user?.idutilisateur) return;

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Update position livreur
                await supabase
                    .from("livreur")
                    .update({ latitudeliv: latitude, longitudeliv: longitude })
                    .eq("idutilisateur", user.idutilisateur);

                // Vérifier proximité pour chaque livraison
                const nouvProches = [];
                livraisons.forEach((liv) => {
                    if (!liv.adresse?.latitudeadrs) return;
                    const dist = distanceKm(
                        latitude, longitude,
                        liv.adresse.latitudeadrs,
                        liv.adresse.longitudeadrs
                    );
                    if (dist < 0.05) { // moins de 50 mètres
                        nouvProches.push(liv.idlivraison);
                    }
                });
                setProcheIds(nouvProches);
            },
            (err) => console.error("GPS error:", err),
            { enableHighAccuracy: true, maximumAge: 3000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [user, livraisons]);

    const confirmerLivraison = async (liv) => {
        await supabase.from("livraison")
            .update({ statutlivraison: "livree", datelivraison: new Date().toISOString() })
            .eq("idlivraison", liv.idlivraison);

        await supabase.from("commande")
            .update({ statutcom: "livree" })
            .eq("idcom", liv.idcom);

        await supabase.from("livreur")
            .update({ statutlivreur: "disponible" })
            .eq("idutilisateur", user.idutilisateur);

        await supabase.from("notification").insert({
            message: `Votre commande #${liv.idcom} a été livrée avec succès !`,
            isread: false,
            datecreationnotif: new Date().toISOString(),
            idutilisateur: liv.commande.idclient,
        });
         await ajouterPoints(liv.commande.idclient, 10, "commande_livree");

        fetchLivraisons();
    };

    return (
        <div className="livraisons-en-cours">
            <h2 className="livraisons-en-cours-title">Livraisons en cours</h2>
            

            {livraisons.length === 0 && (
                <p className="livraisons-en-cours-empty">Aucune livraison en cours.</p>
            )}

            <div className="livraisons-en-cours-list">
                {livraisons.map((liv) => {
                    const estProche = procheIds.includes(liv.idlivraison);
                    return (
                        <div key={liv.idlivraison} className="livraison-en-cours-card">

                            {/* BANNIÈRE PROXIMITÉ */}
                            {estProche && (
                                <div className="livraison-proche-banner">
                                    <FaMapMarkerAlt />
                                    <span>Vous êtes proche de l'adresse client — confirmez à l'arrivée !</span>
                                </div>
                            )}

                            <div className="livraison-en-cours-header">
                                <span className="livraison-en-cours-id">Commande #{liv.idcom}</span>
                                <span className="livraison-en-cours-date">
                                    {new Date(liv.commande.datecom).toLocaleString("fr")}
                                </span>
                            </div>

                            <p className="livraison-en-cours-client">
                                Total : {liv.commande.prixtotal} DA
                            </p>

                            {liv.adresse ? (
                                <p className="livraison-en-cours-adresse">
                                    <FaMapMarkerAlt style={{ marginRight: 5 }} />
                                    {liv.adresse.rue}, {liv.adresse.ville}
                                </p>
                            ) : (
                                <p className="livraison-en-cours-adresse-vide">
                                    Adresse non disponible
                                </p>
                            )}

                            <div className="livraison-en-cours-footer">
                                <span className="livraison-en-cours-total">
                                    Total : {liv.commande.prixtotal} DA
                                </span>
                                <button
                                    className={`btn-confirmer-livraison ${estProche ? "btn-proche" : ""}`}
                                    onClick={() => confirmerLivraison(liv)}
                                >
                                    <FaCheckCircle style={{ marginRight: 6 }} />
                                    Confirmer la livraison
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LivraisonsEnCours;