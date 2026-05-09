import supabase from "./supabaseClient";

export const passerReservation = async ({
    idclient,
    idadmin,
    idtable,
    formData,
    nbrpersonnes,
    panier,
    acompte,
    totalPanier
}) => {

    // 1. Créer la réservation
    const { data: reservation, error: errRes } = await supabase
        .from("reservation")
        .insert({
            datereservation: formData.date,
            heureres: formData.heure,
            nbrpersonnes,
            statutres: "confirmee",
            idclient,
            idtable,
            idadmin
        })
        .select()
        .single();

    if (errRes) return { error: errRes.message };

    // 2. Créer les lignes précommande
    if (panier.length > 0) {
        const lignes = panier.map((item) => ({
            idreservation: reservation.idreservation,
            idplat: item.idplat,
            quantite: item.quantite,
        }));

        const { error: errPre } = await supabase
            .from("precommande")
            .insert(lignes);

        if (errPre) return { error: errPre.message };
    }

    // 3. Enregistrer le paiement (acompte)
    const { error: errPay } = await supabase
        .from("paiement")
        .insert({
            montantpaiement: acompte || 0,
            datepaiement: new Date().toISOString(),
            statutpaiement: acompte > 0 ? "paye" : "gratuit",
            idreservation: reservation.idreservation,
            idcom: null,
        });

    if (errPay) return { error: errPay.message };

    // 4. Notifier l'admin
    await supabase.from("notification").insert({
        message: `Nouvelle réservation #${reservation.idreservation} — Table ${idtable} — ${formData.date} à ${formData.heure} — Acompte : ${acompte} DA`,
        isread: false,
        datecreationnotif: new Date().toISOString(),
        idutilisateur: idadmin
    });

    // 5. Notifier le client
    await supabase.from("notification").insert({
        message: `Votre réservation #${reservation.idreservation} est confirmée ! Le ${formData.date} à ${formData.heure}. Acompte payé : ${acompte} DA. Le reste (${(totalPanier || 0) - (acompte || 0)} DA) sera réglé sur place.`,
        isread: false,
        datecreationnotif: new Date().toISOString(),
        idutilisateur: idclient
    });

    return { success: true, idreservation: reservation.idreservation };
};


// ─── Réservation simple (sans précommande) ───────────────────────────────────
export const passerReservationSimple = async ({
    idclient,
    idadmin,
    idtable,
    formData,
    nbrpersonnes,
}) => {
    const { data: reservation, error: errRes } = await supabase
        .from("reservation")
        .insert({
            datereservation: formData.date,
            heureres: formData.heure,
            nbrpersonnes,
            statutres: "confirmee",
            idclient,
            idtable,
            idadmin
        })
        .select()
        .single();

    if (errRes) return { error: errRes.message };

    // Enregistrer paiement à 0 pour traçabilité
    await supabase.from("paiement").insert({
        montantpaiement: 0,
        datepaiement: new Date().toISOString(),
        statutpaiement: "gratuit",
        idreservation: reservation.idreservation,
        idcom: null,
    });

    // Notifier l'admin
    await supabase.from("notification").insert({
        message: `Nouvelle réservation simple #${reservation.idreservation} — Table ${idtable} — ${formData.date} à ${formData.heure}`,
        isread: false,
        datecreationnotif: new Date().toISOString(),
        idutilisateur: idadmin
    });

    // Notifier le client
    await supabase.from("notification").insert({
        message: `Votre réservation #${reservation.idreservation} est confirmée ! Le ${formData.date} à ${formData.heure}.`,
        isread: false,
        datecreationnotif: new Date().toISOString(),
        idutilisateur: idclient
    });

    return { success: true, idreservation: reservation.idreservation };
};