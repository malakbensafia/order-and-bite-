import { supabase } from "./supabaseClient";

export const validerCodePromo = async (code) => {
    
    const { data, error } = await supabase
        .from("codepromo")
        .select("*")
        .eq("code", code.trim().toUpperCase())
        .single();

    if (error || !data) return { error: "Code promo invalide" };

    const now = new Date();
    const debut = new Date(data.datedebut);
    const fin = new Date(data.datefin);

    if (now < debut || now > fin) return { error: "Code promo expiré" };

    return { data };
};