import React from 'react'
import './SideBar.css'

import { FaTruck, FaUtensils, FaConciergeBell } from "react-icons/fa"

const SideBar = ({ setMode, mode }) => {
  return (
    <div className="sidebar">

      {/* Livraison */}
      <div
        className={`icon-btn ${mode === "livraison" ? "active" : ""}`}
        onClick={() => setMode("livraison")}
      >
        <FaTruck />
      </div>

      {/* Réservation */}
      <div
        className={`icon-btn ${mode === "reservation_simple" ? "active" : ""}`}
        onClick={() => setMode("reservation_simple")}
      >
        <FaUtensils />
      </div>

      {/* Réservation + commande */}
      <div
        className={`icon-btn ${mode === "reservation_commande" ? "active" : ""}`}
        onClick={() => setMode("reservation_commande")}
      >
        <FaConciergeBell />
      </div>

    </div>
  )
}

export default SideBar