import React from 'react'
import './Header.css'

const Header = ({ setShowLogin, setRole, setAuthMode, setRoleFixed }) => {

  const handleClick = () => {
    setRole("client")
    setRoleFixed(true)
    setAuthMode("Se connecter")
    setShowLogin(true)
  }

  return (
    <div className='header'>

      {/* overlay */}
      <div className="header-overlay">

        <div className="header-contents">

          <h1>Commandez vos plats préférés</h1>

          <p>Livraison rapide • Réservation • Expérience premium</p>

          <button onClick={handleClick}>
            Explorer le menu
          </button>

        </div>

      </div>

    </div>
  )
}

export default Header