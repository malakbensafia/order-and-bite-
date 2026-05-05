import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate, Link } from 'react-router-dom'

const Navbar = ({ setShowLogin, setRole, setRoleFixed, setAuthMode }) => {

    const [menu, setMenu] = useState("Accueil")
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    return (
        <div className='navbar'>

            <Link to='/'>
                <img src={assets.logo} alt="" className="logo" />
            </Link>

            <ul className={isOpen ? "navbar-menu active-menu" : "navbar-menu"}>

                <Link to='/'>
                    <li
                        onClick={() => {
                            setMenu("Accueil")
                            setIsOpen(false)
                        }}
                        className={menu === "Accueil" ? "active" : ""}
                    >
                        Accueil
                    </li>
                </Link>

                <li
                    onClick={() => setMenu("Nos services")}
                    className={menu === "Nos services" ? "active" : ""}
                >
                    Nos services
                </li>

                <li
                    onClick={() => setMenu("A propos")}
                    className={menu === "A propos" ? "active" : ""}
                >
                    A propos
                </li>

            </ul>
           

            <div className="navbar-right">
                 


                <button
                    onClick={() => {
                        setRole("client")
                        setRoleFixed(false)
                        setAuthMode("S'inscrire")
                        setShowLogin(true)
                    }}
                    className="navbar-button"
                >
                    S'inscrire
                </button>
                <div className="burger" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✕" : "☰"}
            </div>
            </div>

        </div>
    )
}

export default Navbar 