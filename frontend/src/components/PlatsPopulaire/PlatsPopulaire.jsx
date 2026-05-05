import React from 'react'
import './PlatsPopulaire.css'
import { plats, assets } from '../../assets/assets'
import StarRating from '../StarRating/StarRating'

const getBadge = (discount) => {
  switch (discount) {
    case "-10%":
      return assets.discount10
    case "-15%":
      return assets.discount15
    case "-20%":
      return assets.discount20
    case "-50%":
      return assets.discount50
    case "-75%":
      return assets.discount75
    default:
      return null
  }
}

const PlatsPopulaire = () => {

  const popularPlats = plats.filter(p => p.popular)

  if (popularPlats.length === 0) {
    return (
      <div className="popular">
        <h2>Plats populaires</h2>
        <p>Aucun plat populaire pour le moment</p>
      </div>
    )
  }

  return (
    <div className="popular">

      <h2>Les délices d'aujourd'hui</h2>
      <p>Découvrez nos meilleures offres du moment</p>

      <div className="popular-list">

        {popularPlats.map((plat) => (
          <div key={plat.id} className="card">

            <div className="image-wrapper">

              <img className="plat-img" src={plat.image} />

              {getBadge(plat.discount) && (
                <img
                  className="badge"
                  src={getBadge(plat.discount)}
                  alt="promo"
                />
              )}

            </div>

            <div className="info">

              <h3>{plat.name}</h3>
              <p className="desc">{plat.desc}</p>

              {/* ⭐ INTERACTIF */}
              <StarRating />

              <div className="price">
                {plat.price} DA
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default PlatsPopulaire