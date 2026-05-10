import React from 'react'
import './Header.css'
import { useNavigate } from "react-router-dom"

const Header = ({ setShowLogin, setRole, setAuthMode, setRoleFixed, user }) => {

  const navigate = useNavigate()

  const handleClick = () => {

    // 🔥 si utilisateur connecté → accès direct selon rôle
    if (user) {
      if (user.role === "client") return navigate("/client")
      if (user.role === "admin") return navigate("/admin")
      if (user.role === "livreur") return navigate("/livreur")
      return navigate("/")
    }

    //  sinon ouverture login
    setRole("client")
    setRoleFixed(true)
    setAuthMode("Se connecter")
    setShowLogin(true)
  }

  return (
    <div className='header'>

      <div className="header-overlay">

        <div className="header-contents">

          <h1>Commandez vos plats préférés</h1>

          <p>Livraison rapide • Réservation • Expérience premium</p>

          {/* caché si user connecté (même logique que Services) */}
          {!user && (
            <button onClick={handleClick}>
              Explorer le menu
            </button>
          )}

        </div>

      </div>

    </div>
  )
}

export default Header