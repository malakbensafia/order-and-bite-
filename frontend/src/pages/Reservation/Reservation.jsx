import { useState } from "react";
import "./Reservation.css";
import { zones } from "../../assets/assets";

const Reservation = () => {
  const [zone, setZone] = useState(null);

  return (
    <div className="reservation-page">

      {/* HERO */}
      <div className="reservation-hero">
        <div className="hero-overlay">
          <h1>Réservez votre table selon vos préférences</h1>
          <p>Choisissez une zone pour voir les tables disponibles</p>
        </div>
      </div>

      {/* BODY */}
      <div className="reservation-body">

        {!zone && (
          <div className="zones-grid">
            {zones.map((z) => (
              <div
                key={z.key}
                className="zone-card"
                style={{ backgroundImage: `url(${z.image})` }}
                onClick={() => setZone(z.key)}
              >
                <div className="zone-overlay">
                  <h2>{z.label}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {zone && (
          <div className="tables-section">
            <button className="back-btn" onClick={() => setZone(null)}>
              ← Retour aux zones
            </button>
            <h2>Tables disponibles - {zone}</h2>
            <div className="tables-grid">
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <div key={t} className="table-card">
                  <h3>Table {t}</h3>
                  <p>Capacité : {t % 2 === 0 ? 4 : 2} personnes</p>
                  <span className="status">Libre</span>
                  <button className="reserve-btn">Réserver</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reservation;