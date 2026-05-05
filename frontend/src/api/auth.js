import { supabase } from "./supabaseClient";

// LOGIN
export const loginUser = async (email, password) => {
  const { data, error } = await supabase
    .from("utilisateur")
    .select("*")
    .eq("email", email)
    .eq("motdepasse", password)
    .single();

  if (error) throw error;

  return data;
};

// SIGNUP
export const registerUser = async (form, role) => {

  const { data: user, error } = await supabase
    .from('utilisateur')
    .insert([{
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      telephone: form.telephone,
      motdepasse: form.password,
      role: role
    }])
    .select()
    .single();

  if (error) throw error;

  const id = user.idutilisateur;

  if (role === "client") {
    await supabase.from('client').insert({
      idutilisateur: id,
      pointfidelite: 0
    });
  }

  if (role === "livreur") {
    await supabase.from('livreur').insert({
      idutilisateur: id,
      zonelivraison: "",
      statutlivreur: "disponible",
      latitudeliv: null,
      longitudeliv: null
    });
  }

  return user;
};