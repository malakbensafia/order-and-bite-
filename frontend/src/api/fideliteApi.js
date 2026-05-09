import supabase from "./supabaseClient";

// ================= OBTENIR POINTS =================
export const getPoints = async (idclient) => {
    const { data, error } = await supabase
        .from("client")
        .select("pointfidelite")
        .eq("idutilisateur", idclient)
        .single();

    if (error) { console.error("Erreur getPoints:", error); return 0; }
    return data?.pointfidelite || 0;
};

// ================= AJOUTER POINTS =================
export const ajouterPoints = async (idclient, valeur, type) => {
    // 1. Récupérer points actuels
    const pointsActuels = await getPoints(idclient);

    // 2. Mettre à jour les points
    const { error: errUpdate } = await supabase
        .from("client")
        .update({ pointfidelite: pointsActuels + valeur })
        .eq("idutilisateur", idclient);

    if (errUpdate) { console.error("Erreur ajouterPoints:", errUpdate); return; }

    // 3. Ajouter dans l'historique
    await supabase.from("historiquepoint").insert({
        typehist: type,
        valhist: valeur,
        datehist: new Date().toISOString(),
        idclient
    });
};

// ================= UTILISER POINTS =================
export const utiliserPoints = async (idclient) => {
    const points = await getPoints(idclient);

    if (points < 100) return { error: "Vous n'avez pas assez de points (minimum 100)" };

    // Déduire 100 points
    const { error } = await supabase
        .from("client")
        .update({ pointfidelite: points - 100 })
        .eq("idutilisateur", idclient);

    if (error) return { error: error.message };

    // Historique
    await supabase.from("historiquepoint").insert({
        typehist: "utilisation",
        valhist: -100,
        datehist: new Date().toISOString(),
        idclient
    });

    return { success: true, reduction: 10 }; // 10% de réduction
};

// ================= HISTORIQUE =================
export const getHistorique = async (idclient) => {
    const { data, error } = await supabase
        .from("historiquepoint")
        .select("*")
        .eq("idclient", idclient)
        .order("datehist", { ascending: false });

    if (error) { console.error("Erreur getHistorique:", error); return []; }
    return data || [];
};

// ================= VÉRIFIER 10 000 DA =================
export const verifierBonusDépenses = async (idclient) => {
    // Récupérer toutes les commandes livrées du client
    const { data: commandes } = await supabase
        .from("commande")
        .select("prixtotal")
        .eq("idclient", idclient)
        .eq("statutcom", "livree");

    if (!commandes) return;

    const totalDepense = commandes.reduce((sum, c) => sum + Number(c.prixtotal), 0);

    // Récupérer l'historique pour voir combien de bonus 10 000 DA ont déjà été donnés
    const { data: historique } = await supabase
        .from("historiquepoint")
        .select("*")
        .eq("idclient", idclient)
        .eq("typehist", "bonus_depenses");

    const bonusDeja = (historique?.length || 0) * 10000;
    const nouveauxPaliers = Math.floor((totalDepense - bonusDeja) / 10000);

    if (nouveauxPaliers > 0) {
        await ajouterPoints(idclient, nouveauxPaliers * 100, "bonus_depenses");
    }
};