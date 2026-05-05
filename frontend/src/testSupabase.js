import supabase from "./supabaseClient"

export async function testConnection() {
  const { data, error } = await supabase
    .from("plat")   // mets une table qui existe
    .select("*")

  console.log("DATA =", data)
  console.log("ERROR =", error)
}