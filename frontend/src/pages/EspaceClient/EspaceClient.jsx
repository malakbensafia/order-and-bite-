import React from "react";
import "./EspaceClient.css";
import Dashboard from "./Dashboard";

const EspaceClient = () => {
  return (
    <div className="espace-client">

      {/* HERO */}
      <div className="client-hero">
        <div className="client-hero-overlay">
          <h1>Bienvenue</h1>
          <p>Gérez vos commandes et réservations </p>
        </div>
      </div>

      
      <div className="client-dashboard">
        <Dashboard />
      </div>

    </div>
  );
};

export default EspaceClient;