import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext"

const Navbar = ({ setShowLogin, setRole, setRoleFixed, setAuthMode }) => {

    const [menu, setMenu] = useState("Accueil")
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const { user, logout } = useAuth()

    const handleLogo = () => {
        if (!user) return navigate("/")
        if (user.role === "client") return navigate("/client")
        if (user.role === "admin") return navigate("/admin")
        if (user.role === "livreur") return navigate("/livreur")
        navigate("/")
    }

    const handleLogout = () => {
        const confirm = window.confirm("Se déconnecter ?")
        if (!confirm) return
        logout()
        navigate("/")
    }

    return (
        <>
            <div className='navbar'>
                <img src={assets.logo} alt="" className="logo" onClick={handleLogo} style={{ cursor: "pointer" }} />

                <ul className="navbar-menu">
                    <Link to='/'>
                        <li onClick={() => { setMenu("Accueil"); setIsOpen(false) }} className={menu === "Accueil" ? "active" : ""}>Accueil</li>
                    </Link>
                    <li onClick={() => { setMenu("Nos services"); setIsOpen(false); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }) }} className={menu === "Nos services" ? "active" : ""}>Nos services</li>
                    <li onClick={() => { setMenu("A propos"); setIsOpen(false); document.getElementById("apropos")?.scrollIntoView({ behavior: "smooth" }) }} className={menu === "A propos" ? "active" : ""}>A propos</li>
                </ul>

                <div className="navbar-right">
                    {!user && (
                        <button onClick={() => { setRole("client"); setRoleFixed(false); setAuthMode("S'inscrire"); setShowLogin(true) }} className="navbar-button">
                            S'inscrire
                        </button>
                    )}
                    {user && (
                        <>
                            <button onClick={() => { if (user.role === "client") navigate("/client"); if (user.role === "admin") navigate("/admin"); if (user.role === "livreur") navigate("/livreur") }} className="navbar-button">
                                Mon espace
                            </button>
                            <button onClick={handleLogout} className="navbar-button logout">
                                Déconnexion
                            </button>
                        </>
                    )}
                    <div className="burger" onClick={() => setIsOpen(!isOpen)}>☰</div>
                </div>
            </div>

            {/* OVERLAY */}
            {isOpen && (
                <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
            )}

            {/* DRAWER — seulement les 3 liens */}
            <div className={`drawer ${isOpen ? "drawer-open" : ""}`}>
                <button className="drawer-close" onClick={() => setIsOpen(false)}>✕</button>

                <Link to='/' onClick={() => setIsOpen(false)}>
                    <div className="drawer-item">Accueil</div>
                </Link>
                <div className="drawer-item" onClick={() => { setIsOpen(false); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }) }}>
                    Nos services
                </div>
                <div className="drawer-item" onClick={() => { setIsOpen(false); document.getElementById("apropos")?.scrollIntoView({ behavior: "smooth" }) }}>
                    A propos
                </div>
            </div>
        </>
    )
}

export default Navbar