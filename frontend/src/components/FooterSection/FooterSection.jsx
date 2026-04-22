import React from 'react'
import './FooterSection.css'
import { assets } from '../../assets/assets'
const FooterSection = () => {
  return (
    <div className='footer'id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <h2>Order & Bite</h2>
                <p>Bienvenue dans notre application de restauration moderne.
                        Nous vous proposons une expérience simple, rapide et agréable pour commander vos plats préférés ou réserver une table en ligne.</p>
                        <div className="footer-social-icons">
                            <img src={assets.facebook} alt="" />
                            <img src={assets.twitter} alt="" />
                            <img src={assets.linkedin} alt="" />
                        </div>
                        
                 



            </div>
             <div className="footer-content-center">
                <h2>Compagnie</h2>
                <ul>
                    <li>Accueil</li>
                    <li>A propos</li>
                    <li>Livraison et Réservation</li>
                    <li>Politique de confidentialité</li>
                </ul>
                
            </div>
            <div className="footer-content-right">
                <h2>Contactez-nous</h2>
                <ul>
                    <li>+213-05-65-43-34-22</li>
                    <li>contact@orderbite.com</li>
                </ul>


            </div>
           
        </div>
        <hr/>
        <p className="footer-copyright"> Copyright © 2026 BiteOrder.com - All Rights Reserved.</p>
      
    </div>
  )
}

export default FooterSection
