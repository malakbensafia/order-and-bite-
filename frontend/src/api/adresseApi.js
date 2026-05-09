import supabase from "./supabaseClient";

// ================= CHARGER ADRESSES =================
export const loadAddresses = async (idclient) => {
    const { data, error } = await supabase
        .from("adresse")
        .select("*")
        .eq("idclient", idclient);

    if (error) { console.error("Erreur chargement:", error); return []; }
    return data || [];
};

// ================= RECHERCHE ADRESSE =================
export const searchBejaiaAddress = async (text) => {
    if (text.length < 2) return [];

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text + " Béjaïa Algérie")}&addressdetails=1&limit=8`,
            { headers: { "Accept-Language": "fr" } }
        );
        const data = await res.json();

        return data.map((item) => ({
            rue: item.display_name.split(",")[0],
            ville: item.address?.city || item.address?.town || item.address?.county || "Béjaïa",
            latitude: item.lat,
            longitude: item.lon
        }));
    } catch (err) {
        console.error("Erreur:", err);
        return [];
    }
};

// ================= AJOUTER ADRESSE MANUELLE =================
export const addAddressManuelle = async (rue, ville, idclient) => {
    let latitude = "36.7517";
    let longitude = "5.0643";

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(rue)} ${encodeURIComponent(ville)}&limit=1`
        );
        const data = await res.json();
        if (data.length > 0) {
            latitude = data[0].lat;
            longitude = data[0].lon;
        }
    } catch (err) {
        console.error("Erreur géocodage:", err);
    }

    // vérifier doublon
    const { data: existing } = await supabase
        .from("adresse")
        .select("*")
        .eq("idclient", idclient)
        .eq("rue", rue)
        .eq("ville", ville);

    if (existing && existing.length > 0) return { error: "doublon" };

    const { error } = await supabase
        .from("adresse")
        .insert({
            rue,
            ville,
            latitudeadrs: parseFloat(latitude),
            longitudeadrs: parseFloat(longitude),
            idclient
        });

    if (error) return { error: error.message };
    return { success: true };
};

// ================= AJOUTER ADRESSE GPS =================
export const addAddressGPS = async (latitude, longitude, idclient) => {
    const { error } = await supabase
        .from("adresse")
        .insert({
            rue: null,
            ville: "Béjaïa",
            latitudeadrs: latitude,
            longitudeadrs: longitude,
            idclient
        });

    if (error) return { error: error.message };
    return { success: true };
};

// ================= SUPPRIMER ADRESSE =================
export const deleteAddress = async (idadrs) => {
    const { error } = await supabase
        .from("adresse")
        .delete()
        .eq("idadrs", idadrs);

    if (error) return { error: error.message };
    return { success: true };
};
// ================= CHARGER COORDS RESTAURANT (ADMIN) =================
export const loadAdminCoords = async () => {
    const { data, error } = await supabase
        .from("admin")
        .select("idutilisateur, latitudeadmin, longitudeadmin")  // 👈 ajoute idutilisateur
        .single();

    if (error) { console.error("Erreur chargement admin:", error); return null; }
    return data;
};