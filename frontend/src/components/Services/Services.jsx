import React from 'react'
import './Services.css'
import restoImg from '../../assets/restaurant.jpg'
import StarRating from '../StarRating/StarRating'

const Services = () => {

  return (
    <div className='services'>

      {/* 🍽️ RESTAURANT */}
      <div className="restaurant">

        <img src={restoImg} alt="restaurant" />

        <div className="resto-text">

          <h2>Notre Restaurant</h2>

          <p>
            Nous proposons une cuisine variée avec des plats frais,
            préparés chaque jour avec des ingrédients de qualité.
            Une ambiance moderne pensée pour offrir le meilleur confort.
          </p>

          {/* INFOS */}
          <div className="info-box">
            <div>Service sur place</div>
            <div>Livraison rapide</div>
            <div>Expérience premium</div>
          </div>

          {/* ⭐ RATING SIMPLE (AFFICHAGE UNIQUEMENT) */}
          <div className="rating-box">

            <StarRating rating={4.6} />

            <span>4.6 / 5 (150 avis)</span>

          </div>

        </div>

      </div>

      {/* SERVICES */}
      <h2 className="title">Nos services</h2>

      <div className="services-grid">

        <div className="card client">
          <h3>Client</h3>
          <p>Commander et réserver facilement en ligne.</p>
        </div>

        <div className="card delivery">
          <h3>Livreur</h3>
          <p>Livraison rapide et sécurisée à domicile.</p>
        </div>

        <div className="card admin">
          <h3>Restaurant</h3>
          <p>Gérer les commandes, le menu et les avis.</p>
        </div>

      </div>

      {/* MAP */}
      <div className="map-section">

        <h2>Localisation</h2>

        <iframe
          src="https://www.google.com/maps?q=Bab+Ezzouar&output=embed"
          width="100%"
          height="300"
          loading="lazy"
        ></iframe>

      </div>

    </div>
  )
}

export default Services