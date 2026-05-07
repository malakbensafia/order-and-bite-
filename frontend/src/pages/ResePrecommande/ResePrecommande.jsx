import React, { useEffect, useContext } from 'react';
import './ResePrecommande.css';
import { StoreContext } from '../../context/StoreContext';

const ResePrecommande = () => {
  const { setModePanier } = useContext(StoreContext); // 👈 AJOUTE ÇA

  useEffect(() => {
    setModePanier("precommande");
  }, []);

  return (
    <div className="respre-page-wrapper">
      <div className="respre-hero-full">
        <div className="respre-overlay-full">
          <div className="respre-hero-content">
            <h1>Réservation + Précommande</h1>
            <p>Réservez votre table et précommandez vos plats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResePrecommande;