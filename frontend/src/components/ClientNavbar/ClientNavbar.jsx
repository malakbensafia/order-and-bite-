import React, { useState, useEffect, useContext } from "react";
import "./ClientNavbar.css";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext"
import { FaSignOutAlt } from "react-icons/fa";
import supabase from "../../api/supabaseClient"; // 👈 ajouté

const ClientNavbar = () => {
    const [menu, setMenu] = useState("Livraison");
    const [nonLues, setNonLues] = useState(0); // 👈 ajouté

    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(StoreContext);

    if (!context) return null;

    const { getTotalItems } = context;
    const { logout, user } = useAuth()
    const isClient = user?.role === "client"

    // 👈 ajouté
    useEffect(() => {
        if (!user?.idutilisateur) return;
        const fetchNonLues = async () => {
            const { count } = await supabase
                .from("notification")
                .select("*", { count: "exact" })
                .eq("idutilisateur", user.idutilisateur)
                .eq("isread", false);
            setNonLues(count || 0);
        };
        fetchNonLues();
    }, [user]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Es-tu sûr de vouloir te déconnecter ?")
        if (!confirmLogout) return
        logout()
        navigate("/")
    }

    const handleProfile = () => {
        if (!user) { navigate("/"); return }
        if (user.role === "client") navigate("/client")
        else if (user.role === "livreur") navigate("/livreur")
        else if (user.role === "admin") navigate("/admin")
        else navigate("/")
    }

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
                            onClick={() => { setMenu("Livraison"); navigate("/livraison"); }}
                            className={menu === "Livraison" ? "active" : ""}
                        >
                            Livraison
                        </li>
                        <li
                            onClick={() => { setMenu("Réservation"); navigate("/reservation"); }}
                            className={menu === "Réservation" ? "active" : ""}
                        >
                            Réservation
                        </li>
                        <li
                            onClick={() => { setMenu("Précommande"); navigate("/respre"); }}
                            className={menu === "Précommande" ? "active" : ""}
                        >
                            Réservation + Précommande
                        </li>
                    </ul>
                )}
            </div>

            <div className="client-navbar-right">

                {isClient && (
                    <div className="icon-wrapper" onClick={() => navigate("/cart")}>
                        <img src={assets.cart} alt="cart" className="iconcart" />
                        {getTotalItems() > 0 && (
                            <span className="cart-dot"></span>
                        )}
                    </div>
                )}

                {/* BELL — inchangé + badge nonLues */}
                <div className="icon-wrapper" onClick={() => navigate("/notifications")}>
                    <img src={assets.bell} alt="notif" className="iconbell" />
                    {nonLues > 0 && <span className="bell-dot"></span>} // 
                </div>

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