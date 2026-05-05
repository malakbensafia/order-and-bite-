import React, { useState, useContext } from "react";
import "./ClientNavbar.css";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom"; // 🔥 ajoute useLocation
import { StoreContext } from "../../context/StoreContext";

const ClientNavbar = () => {
  const [menu, setMenu] = useState("Livraison");
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 détecte la page actuelle
  const { getTotalItems } = useContext(StoreContext);

  // 🔥 pages où la navbar doit avoir un fond coloré
  const isCartPage = location.pathname === "/cart";

  return (
    <div className={`client-navbar ${isCartPage ? "navbar-cart" : ""}`}>

     
      <div className="client-navbar-left">
        <img
          src={assets.logo}
          alt="logo"
          className="logo"
          onClick={() => navigate("/")}
        />
      </div>

    
      <div className="client-navbar-center">
        <ul className="client-navbar-menu">

          <li
            onClick={() => {
              setMenu("Livraison");
              navigate("/livraison");
            }}
            className={menu === "Livraison" ? "active" : ""}
          >
            Livraison
          </li>

          <li
            onClick={() => {
              setMenu("Réservation");
              navigate("/reservation");
            }}
            className={menu === "Réservation" ? "active" : ""}
          >
            Réservation
          </li>

          <li
            onClick={() => {
              setMenu("Précommande");
              navigate("/reservation");
            }}
            className={menu === "Précommande" ? "active" : ""}
          >
            Réservation + Précommande
          </li>

        </ul>
      </div>

      {/* RIGHT */}
      <div className="client-navbar-right">

        <div className="icon-wrapper" onClick={() => navigate("/cart")}>
          <img src={assets.cart} alt="cart" className="iconcart" />

          {getTotalItems() > 0 && (
            <span className="cart-dot">{getTotalItems()}</span>
          )}
        </div>

        <img
          src={assets.bell}
          alt="notif"
          className="iconbell"
          onClick={() => navigate("/notifications")}
        />

        <img
          src={assets.user}
          alt="user"
          className="iconuser"
          onClick={() => navigate("/client")}
        />

      </div>

    </div>
  );
};

export default ClientNavbar;