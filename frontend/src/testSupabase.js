import supabase from "./supabaseClient"

export async function testConnection() {
  const { data, error } = await supabase
    .from("plat")   
    .select("*")

  console.log("DATA =", data)
  console.log("ERROR =", error)
}