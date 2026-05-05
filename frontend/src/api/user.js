import supabase from "../supabaseClient"

export const createRole = async (id, role) => {
  if (role === "client") {
    await supabase.from("client").insert({
      idutilisateur: id,
      pointfidelite: 0
    })
  }

  if (role === "livreur") {
    await supabase.from("livreur").insert({
      idutilisateur: id,
      zonelivraison: "",
      statutlivreur: "disponible",
      latitudeliv: null,
      longitudeliv: null
    })
  }

  if (role === "admin") {
    await supabase.from("admin").insert({
      idutilisateur: id,
      latitudeadmin: null,
      longitudeadmin: null
    })
  }
}