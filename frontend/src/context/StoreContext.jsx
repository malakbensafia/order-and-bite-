
import { food_list } from "../assets/assets";
import { createContext, useState, useEffect } from "react";
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {


  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);

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
  };



  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev, [itemId]: (prev[itemId] || 0) + 1
    }));
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId]

      console.log("before:", current)

      if (!current) return prev

      const updated = { ...prev }
      updated[itemId] = current - 1

      if (updated[itemId] <= 0) {
        delete updated[itemId]
      }

      return updated
    })
  }
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      const quantity = cartItems[item];

      if (quantity > 0) {
        const itemInfo = food_list.find(
          (product) => String(product._id) === String(item)
        );

        if (itemInfo) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }

    return totalAmount;
  };

  const getTotalItems = () => {
    let total = 0;

    for (const item in cartItems) {
      total += cartItems[item];
    }

    return total;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalItems,
    user,
    setUser,
    login,
    logout

  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )


}
export default StoreContextProvider;