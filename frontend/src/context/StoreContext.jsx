import { createContext, useState, useEffect } from "react";
import supabase from "../api/supabaseClient";
import { getFinalPrice } from "../outils/promotion";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [plats, setPlats] = useState([]);
  const [panierId, setPanierId] = useState(null);
  const [modePanier, setModePanier] = useState("livraison"); // 👈 NOUVEAU

  // =========================
  // LOAD USER
  // =========================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCartItems({});
    setPanierId(null);
  };

  // =========================
  // LOAD PLATS
  // =========================

  // 1️⃣ Extraire en fonction nommée (remplace votre useEffect actuel)
  const fetchPlats = async () => {
    const { data, error } = await supabase
      .from("plat")
      .select(`*, promotionplat (idpromoplat, idplat, tauxreduction, datedebutpromo, datefinpromo)`);
    if (!error) setPlats(data || []);
  };

  useEffect(() => {
    fetchPlats();
  }, []);


  // =========================
  // LOAD PANIER DEPUIS SUPABASE
  // =========================
  useEffect(() => {
    const fetchPanier = async () => {
      if (!user) return;
      if (!panierId) {
        // cherche ou crée le panier
        let { data: panier } = await supabase
          .from("panier")
          .select("*")
          .eq("idclient", user.idutilisateur)
          .single();

        if (!panier) {
          const { data: newPanier } = await supabase
            .from("panier")
            .insert([{ idclient: user.idutilisateur, typepan: modePanier }])
            .select()
            .single();
          panier = newPanier;
        }

        setPanierId(panier.idpan);

        // charge les lignes
        const { data: lignes } = await supabase
          .from("lignepanier")
          .select("*")
          .eq("idpan", panier.idpan)
          .eq("typeligne", modePanier);

        const items = {};
        lignes?.forEach(l => {
          items[String(l.idplat)] = l.quantite;
        });
        setCartItems(items);

      } else {
        // panier déjà chargé, recharge juste les lignes du mode actif
        const { data: lignes } = await supabase
          .from("lignepanier")
          .select("*")
          .eq("idpan", panierId)
          .eq("typeligne", modePanier);

        const items = {};
        lignes?.forEach(l => {
          items[String(l.idplat)] = l.quantite;
        });
        setCartItems(items);
      }
    };

    fetchPanier();
  }, [user, modePanier]); // 👈 se relance quand user change

  // =========================
  // CART LOGIC
  // =========================
  const addToCart = async (itemId) => {
    // 1️⃣ Update local
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    // 2️⃣ Sync Supabase
    const { data: existing } = await supabase
      .from("lignepanier")
      .select("*")
      .eq("idpan", panierId)
      .eq("idplat", itemId)
      .eq("typeligne", modePanier)
      .single();

    if (existing) {
      await supabase
        .from("lignepanier")
        .update({ quantite: existing.quantite + 1 })
        .eq("idlignepanier", existing.idlignepanier);
    } else {
      await supabase
        .from("lignepanier")
        .insert([{ idpan: panierId, idplat: itemId, quantite: 1, typeligne: modePanier }]);
    }
  };

  const removeFromCart = async (itemId) => {
    // 1️⃣ Update local
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[itemId]) return prev;
      updated[itemId] -= 1;
      if (updated[itemId] <= 0) delete updated[itemId];
      return updated;
    });

    // 2️⃣ Sync Supabase
    const { data: existing } = await supabase
      .from("lignepanier")
      .select("*")
      .eq("idpan", panierId)
      .eq("idplat", itemId)
      .eq("typeligne", modePanier)
      .single();

    if (!existing) return;

    if (existing.quantite <= 1) {
      await supabase
        .from("lignepanier")
        .delete()
        .eq("idlignepanier", existing.idlignepanier);
    } else {
      await supabase
        .from("lignepanier")
        .update({ quantite: existing.quantite - 1 })
        .eq("idlignepanier", existing.idlignepanier);
    }
  };

  // =========================
  // TOTAL
  // =========================
  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const quantity = cartItems[id];
      if (quantity > 0) {
        const product = plats.find((p) => String(p.idplat) === String(id));
        if (product) {
          total += getFinalPrice(product) * quantity;
        }
      }
    }
    return total;
  };

  const getTotalItems = () => {
    let total = 0;
    for (const id in cartItems) total += cartItems[id];
    return total;
  };
const clearCart = async () => {
  setCartItems({})
  if (panierId) {
    await supabase
      .from("lignepanier")
      .delete()
      .eq("idpan", panierId)
      .eq("typeligne", modePanier)  
  }
}

  // =========================
  // CONTEXT VALUE
  // =========================
  const contextValue = {
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalItems,
    plats,
    panierId,
    modePanier,
    setModePanier, // 👈 IMPORTANT
    user,
    login,
    logout,
     refreshPlats: fetchPlats,
       clearCart 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;