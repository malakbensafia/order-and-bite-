import React, { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import './CommandesLivreur.css';

const CommandesLivreur = () => {
    const [commandes, setCommandes] = useState([]);
    const { user } = useAuth();

    const fetchCommandes = async () => {
        const { data: cmds } = await supabase
            .from("commande")
            .select("*")
            .eq("statutcom", "en_attente_livreur")
            .order("datecom", { ascending: false });

        if (!cmds) return;

        const enriched = await Promise.all(cmds.map(async (cmd) => {
            const { data: u } = await supabase
                .from("utilisateur")
                .select("nom, prenom, telephone")
                .eq("idutilisateur", cmd.idclient)
                .single();

            const { data: lignes } = await supabase
                .from("lignecommande")
                .select("quantitecom, idplat")
                .eq("idcom", cmd.idcom);

            const lignesAvecPlat = await Promise.all((lignes || []).map(async (l) => {
                const { data: plat } = await supabase
                    .from("plat").select("nomplat").eq("idplat", l.idplat).single();
                return { ...l, plat };
            }));

            const { data: adresse } = await supabase
                .from("adresse")
                .select("*")
                .eq("idclient", cmd.idclient)
                .order("idadrs", { ascending: false })
                .limit(1)
                .maybeSingle();

            return { ...cmd, clientInfo: u, lignes: lignesAvecPlat, adresse };
        }));

        setCommandes(enriched);
    };

    useEffect(() => {
        fetchCommandes();

        const channel = supabase
            .channel("livreur-commandes")
            .on("postgres_changes", { event: "*", schema: "public", table: "commande" }, fetchCommandes)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const accepterCommande = async (cmd) => {
        // Vérifier que personne n'a déjà accepté (race condition)
        const { data: cmdActuelle } = await supabase
            .from("commande")
            .select("statutcom")
            .eq("idcom", cmd.idcom)
            .single();

        if (cmdActuelle?.statutcom !== "en_attente_livreur") {
            alert("Cette commande a déjà été prise par un autre livreur.");
            fetchCommandes();
            return;
        }

        // Bloquer immédiatement pour les autres livreurs
        await supabase.from("commande")
            .update({ statutcom: "en_livraison" })
            .eq("idcom", cmd.idcom);

        const { data: adresse } = await supabase
            .from("adresse")
            .select("idadrs")
            .eq("idclient", cmd.idclient)
            .order("idadrs", { ascending: false })
            .limit(1)
            .maybeSingle();

        // Vérifier si livraison existe déjà (créée par admin)
        const { data: livExist } = await supabase
            .from("livraison")
            .select("idlivraison")
            .eq("idcom", cmd.idcom)
            .maybeSingle();

        if (livExist) {
            await supabase.from("livraison")
                .update({
                    idlivreur: user.idutilisateur,
                    statutlivraison: "en_livraison",
                    datelivraison: new Date().toISOString(),
                })
                .eq("idlivraison", livExist.idlivraison);
        } else {
            await supabase.from("livraison").insert({
                datelivraison: new Date().toISOString(),
                statutlivraison: "en_livraison",
                idcom: cmd.idcom,
                idlivreur: user.idutilisateur,
                idadrs: adresse?.idadrs || null,
            });
        }

        await supabase.from("livreur")
            .update({ statutlivreur: "indisponible" })
            .eq("idutilisateur", user.idutilisateur);

        await supabase.from("notification").insert({
            message: `Votre commande #${cmd.idcom} est en cours de livraison !`,
            isread: false,
            datecreationnotif: new Date().toISOString(),
            idutilisateur: cmd.idclient,
        });

        alert("Commande acceptée !");
        fetchCommandes();
    };

    const refuserCommande = async (cmd) => {
        // Notifier l'admin
        if (cmd.idadmin) {
            await supabase.from("notification").insert({
                message: `Un livreur a refusé la commande #${cmd.idcom}. Veuillez en assigner un autre.`,
                isread: false,
                datecreationnotif: new Date().toISOString(),
                idutilisateur: cmd.idadmin,
            });
        }
        // La commande reste en "en_attente_livreur" pour les autres livreurs
        alert("Commande refusée. L'admin a été notifié.");
    };

    return (
        <div>
            <h2>Commandes disponibles</h2>

            {commandes.length === 0 && (
                <p style={{ color: "#999", marginTop: 20 }}>
                    Aucune commande disponible pour le moment.
                </p>
            )}

            {commandes.map((cmd) => (
                <div key={cmd.idcom} className="commande-livreur-card">
                    <div className="commande-livreur-header">
                        <span className="commande-livreur-id">Commande #{cmd.idcom}</span>
                        <span className="commande-livreur-date">
                            {new Date(cmd.datecom).toLocaleString("fr")}
                        </span>
                    </div>

                    <p className="commande-livreur-client">
                        Client : {cmd.clientInfo?.prenom} {cmd.clientInfo?.nom} — {cmd.clientInfo?.telephone}
                    </p>

                    {cmd.adresse && (
                        <p className="commande-livreur-adresse">
                            📍 {cmd.adresse.rue}, {cmd.adresse.ville}
                        </p>
                    )}

                    <div className="commande-livreur-plats">
                        {cmd.lignes?.map((l, i) => (
                            <p key={i}>{l.quantitecom}× {l.plat?.nomplat}</p>
                        ))}
                    </div>

                    <div className="commande-livreur-footer">
                        <span className="commande-livreur-total">
                            Total : {cmd.prixtotal} DA
                        </span>
                        <div className="commande-livreur-actions">
                            <button className="btn-accepter-livreur" onClick={() => accepterCommande(cmd)}>
                                Accepter
                            </button>
                            <button className="btn-refuser-livreur" onClick={() => refuserCommande(cmd)}>
                                Refuser
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommandesLivreur;