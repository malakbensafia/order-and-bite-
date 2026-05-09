import supabase from "./supabaseClient";
import { verifierBonusDépenses } from "./fideliteApi";
export const passerCommande = async ({ idclient, idadmin, cartItems, plats, fraisLivraison, prixtotal }) => {

    // 1. Créer la commande
    const { data: commande, error: errCom } = await supabase
        .from("commande")
        .insert({
            datecom: new Date().toISOString(),
            statutcom: "en_attente",
            prixtotal: prixtotal + fraisLivraison,
            idclient,
            idadmin,
            idcodepromo: null
        })
        .select()
        .single();

    if (errCom) return { error: errCom.message };

    // 2. Créer les lignes commande
    const lignes = Object.entries(cartItems)
        .filter(([_, quantite]) => quantite > 0)
        .map(([idplat, quantite]) => {
            const plat = plats.find((p) => String(p.idplat) === String(idplat));
            return {
                quantitecom: quantite,
                prixunitaire: plat ? Number(plat.prix) : 0,
                idcom: commande.idcom,
                idplat: parseInt(idplat)
            };
        });

    const { error: errLignes } = await supabase
        .from("lignecommande")
        .insert(lignes);

    if (errLignes) return { error: errLignes.message };
    //vdier le panier
    const { data: panier } = await supabase
        .from("panier")
        .select("idpan")
        .eq("idclient", idclient)
        .single();

    if (panier) {
        await supabase
            .from("lignepanier")
            .delete()
            .eq("idpan", panier.idpan);
    }

    // 3. Enregistrer le paiement
    const { error: errPay } = await supabase
        .from("paiement")
        .insert({
            montantpaiement: prixtotal + fraisLivraison,
            datepaiement: new Date().toISOString(),
            statutpaiement: "payé",
            idcom: commande.idcom
        });

    if (errPay) return { error: errPay.message };
    await verifierBonusDépenses(idclient);

    //  pas de livraison ici  elle est ajoutée a la bdd  quand le livreur accepte
    return { success: true, idcom: commande.idcom };
};

// RÉCUPÉRER LES COMMANDES D'UN CLIENT
export const getCommandesClient = async (idclient) => {
    const { data, error } = await supabase
        .from("commande")
        .select("*")
        .eq("idclient", idclient)
        .order("datecom", { ascending: false });

    if (error) return [];
    return data;
};

// RÉCUPÉRER LES LIGNES D'UNE COMMANDE
export const getLignesCommande = async (idcom) => {
    const { data, error } = await supabase
        .from("lignecommande")
        .select("*, plat(nomplat, prix)")
        .eq("idcom", idcom);

    if (error) return [];
    return data;
};