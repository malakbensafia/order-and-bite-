import React, { useState, useContext } from "react";
import "./ClientNavbar.css";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext"
import { FaSignOutAlt } from "react-icons/fa";
const ClientNavbar = () => {
    const [menu, setMenu] = useState("Livraison");
    const navigate = useNavigate();
    const location = useLocation(); // 🔥 détecte la page Aactuelle
    const context = useContext(StoreContext);

    if (!context) {
        return null; 
    }

    const { getTotalItems } = context;
    const { logout, user } = useAuth()
    console.log("USER =", user)
    const isClient = user?.role === "client"


    const handleLogout = () => {
        const confirmLogout = window.confirm("Es-tu sûr de vouloir te déconnecter ?")

        if (!confirmLogout) return

        logout()
        navigate("/")
    }
    const handleProfile = () => {
        if (!user) {
            navigate("/")
            return
        }

        if (user.role === "client") {
            navigate("/client")
        }
        else if (user.role === "livreur") {
            navigate("/livreur")
        }
        else if (user.role === "admin") {
            navigate("/admin")
        }
        else {
            navigate("/")
        }
    }

    //  pages où la navbar doit avoir un fond coloré
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

                {isClient && (
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
                                navigate("/respre");
                            }}
                            className={menu === "Précommande" ? "active" : ""}
                        >
                            Réservation + Précommande
                        </li>

                    </ul>
                )}

            </div>

            {/* RIGHT */}
            <div className="client-navbar-right">

                {isClient && (
                    <div className="icon-wrapper" onClick={() => navigate("/cart")}>
                        <img src={assets.cart} alt="cart" className="iconcart" />

                        {getTotalItems() > 0 && (
                             <span className="cart-dot"></span>
                        )}
                    </div>
                )}



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
                    onClick={handleProfile}
                />
                <FaSignOutAlt
                    className="iconlogout"
                    onClick={handleLogout}
                />

            </div>

        </div>
    );
};

export default ClientNavbar;