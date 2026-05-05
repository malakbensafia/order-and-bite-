import React from 'react'
import './HeaderLivraison.css'
import { assets } from '../../assets/assets'

const HeaderLivraison = () => {
  return (
    <div className="header-livraison">
              <div className="header-left">
        <img src={assets.avatar} alt="chef" />
      </div>

      <div className="header-right">
        <div className="bulle">
          <h3>Comment commander ?</h3>
          <p>
            <span>1</span> Choisissez une catégorie <br/>
            <span>2</span> Sélectionnez vos plats <br/>
            <span>3</span> Passez votre commande 
          </p>
        </div>
      </div>


         

      
    </div>
  )
}

export default HeaderLivraison
