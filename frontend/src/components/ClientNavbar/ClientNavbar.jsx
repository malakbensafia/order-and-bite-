import React, { useState, useEffect, useContext } from "react";
import "./ClientNavbar.css";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext"
import supabase from "../../api/supabaseClient"; 
import { FaSignOutAlt, FaBars } from "react-icons/fa";

const ClientNavbar = () => {
    const [menu, setMenu] = useState("Livraison");
    const [nonLues, setNonLues] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false); // ✅ AJOUTÉ

    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(StoreContext);

    if (!context) return null;

    const { getTotalItems } = context;
    const { logout, user } = useAuth()
    const isClient = user?.role === "client"

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

    // ✅ AJOUTÉ — fermer drawer au changement de route
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

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

    // ✅ AJOUTÉ
    const drawerBtn = {
        background: "rgba(255,255,255,0.08)",
        border: "none",
        color: "white",
        padding: "14px 16px",
        borderRadius: "10px",
        fontSize: "15px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
    };

    const isCartPage = location.pathname === "/cart";

    return (
        <>
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
                            {getTotalItems() > 0 && <span className="cart-dot"></span>}
                        </div>
                    )}

                    <div className="icon-wrapper" onClick={() => navigate("/notifications")}>
                        <img src={assets.bell} alt="notif" className="iconbell" />
                        {nonLues > 0 && <span className="bell-dot"></span>}
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

                    <button className="hamburger" onClick={() => setMobileOpen(true)}>
                        <FaBars />
                    </button>

                </div>
            </div>

            {/* ✅ AJOUTÉ — Overlay sombre */}
            {mobileOpen && (
                <div
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 1100
                    }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ✅ AJOUTÉ — Drawer latéral */}
            <div style={{
                position: "fixed", top: 0, right: 0,
                width: "260px", height: "100%",
                background: "#3E2C23", zIndex: 1200,
                transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.3s ease",
                padding: "24px 20px",
                display: "flex", flexDirection: "column", gap: "8px",
                boxSizing: "border-box",
            }}>
                <button
                    onClick={() => setMobileOpen(false)}
                    style={{ background: "none", border: "none", color: "white", fontSize: 22, alignSelf: "flex-end", cursor: "pointer", marginBottom: "16px" }}
                >
                    ✕
                </button>

                {isClient && (
                    <>
                        <button onClick={() => { navigate("/livraison"); setMobileOpen(false); }} style={drawerBtn}>
                             Livraison
                        </button>
                        <button onClick={() => { navigate("/reservation"); setMobileOpen(false); }} style={drawerBtn}>
                             Réservation
                        </button>
                        <button onClick={() => { navigate("/respre"); setMobileOpen(false); }} style={drawerBtn}>
                            Résa + Précommande
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default ClientNavbar;