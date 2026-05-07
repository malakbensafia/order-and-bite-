import supabase from "./supabaseClient";

// ================= AJOUT AVIS =================
export const addAvis = async (avis) => {

  const { data, error } = await supabase
    .from("avis")
    .insert([avis])
    .select();

  if (error) {
    console.log("ERREUR AVIS :", error);
    return null;
  }

  return data;
};


// ================= UPDATE MOYENNE =================
export const updateMoyennePlat = async (idplat) => {

  const { data, error } = await supabase
    .from("avis")
    .select("note")
    .eq("idplat", idplat);

  if (error) {
    console.log("ERREUR GET AVIS :", error);
    return;
  }

  if (!data || data.length === 0) return;

  const notes = data
    .map(a => Number(a.note))
    .filter(n => !isNaN(n));

  if (notes.length === 0) return;

  const total = notes.reduce((sum, n) => sum + n, 0);

  const moyenne = total / notes.length;

  const { error: updateError } = await supabase
    .from("plat")
    .update({
      moyenne: Number(moyenne.toFixed(1))
    })
    .eq("idplat", idplat);

  if (updateError) {
    console.log("ERREUR UPDATE MOYENNE :", updateError);
  }
};


// ================= GET MOYENNE =================
export const getMoyennePlat = async (idplat) => {

  const { data, error } = await supabase
    .from("plat")
    .select("moyenne")
    .eq("idplat", idplat)
    .single();

  if (error) {
    console.log("ERREUR GET MOYENNE :", error);
    return 0;
  }

  return Number(data?.moyenne || 0);
};


// ================= GET AVIS PLAT =================
export const getAvisPlat = async (idplat) => {

  const { data, error } = await supabase
    .from("avis")
    .select("*")
    .eq("idplat", idplat)
    .order("dateavis", { ascending: false });

  if (error) {
    console.log("ERREUR GET AVIS :", error);
    return [];
  }

  return data || [];
};