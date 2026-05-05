import React from 'react'
import './Services.css'
import restoImg from '../../assets/restaurant.jpg'
import StarRating from '../StarRating/StarRating'
import clientImg from '../../assets/client.jpg'
import livreurImg from '../../assets/livreur.jpg'
import adminImg from '../../assets/resto.jpg'

const Services = ({
  setShowLogin,
  setRole,
  setRoleFixed,
  setAuthMode
}) => {

  const handleAccess = (role, path) => {

  setRole(role)
  setRoleFixed(true)

  // toujours login
  setAuthMode("Se connecter")

  setShowLogin(true)

  sessionStorage.setItem("targetPath", path)
}

  return (
    <div className='services'>

      <div className="restaurant">
        <img src={restoImg} alt="restaurant" />

        <div className="resto-text">
          <h2>Notre Restaurant</h2>
          <p>Nous proposons une cuisine variée avec des plats frais.</p>

          <div className="info-box">
            <div>Service sur place</div>
            <div>Livraison rapide</div>
            <div>Expérience premium</div>
          </div>

          <div className="rating-box">
            <StarRating rating={4.6} />
            <span>4.6 / 5 (150 avis)</span>
          </div>
        </div>
      </div>

      <h2 className="title">Nos services</h2>

      <div className="services-grid">

        <div className="service-card" onClick={() => handleAccess("client", "/")}>
          <img src={clientImg} alt="client" />
          <h3>Client</h3>
        </div>

        <div className="service-card" onClick={() => handleAccess("livreur", "/livraison")}>
          <img src={livreurImg} alt="livreur" />
          <h3>Livreur</h3>
        </div>

        <div className="service-card" onClick={() => handleAccess("admin", "/admin")}>
          <img src={adminImg} alt="admin" />
          <h3>Admin</h3>
        </div>

      </div>
    </div>
  )
}

export default Services