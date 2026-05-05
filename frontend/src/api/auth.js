import supabase from "../supabaseClient"

// INSCRIPTION
export const signUp = async (form, role) => {
  const { data, error } = await supabase
    .from("utilisateur")
    .insert([{
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      telephone: form.telephone,
      motdepasse: form.password,
      role: role
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// CONNEXION
export const login = async (email, password) => {
  const { data, error } = await supabase
    .from("utilisateur")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !data) throw new Error("Email incorrect")

  if (data.motdepasse !== password)
    throw new Error("Mot de passe incorrect")

  return data
}