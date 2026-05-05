import React, { useState } from "react";
import "./Dashboard.css";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaHistory,
  FaPlus,
  FaTrash,
  FaUser,
  FaBars
} from "react-icons/fa";

const Dashboard = () => {

  const [page, setPage] = useState("adresses");
  const [open, setOpen] = useState(false); // 🔥 TOGGLE

  const menu = [
    { key: "profil", label: "Profil", icon: <FaUser /> },
    { key: "adresses", label: "Adresses", icon: <FaMapMarkerAlt /> },
    { key: "favoris", label: "Favoris", icon: <FaHeart /> },
    { key: "activite", label: "Activité", icon: <FaHistory /> },
  ];

  const [addresses, setAddresses] = useState([]);
  const [input, setInput] = useState("");

  const addAddress = () => {
    if (input.trim() === "") return;
    setAddresses([...addresses, input]);
    setInput("");
  };

  const deleteAddress = (i) => {
    setAddresses(addresses.filter((_, index) => index !== i));
  };

  return (
    <div className="client-container">

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "open" : ""}`}>

        {/* TOGGLE BUTTON */}
        <button className="toggle-btn" onClick={() => setOpen(!open)}>
          <FaBars />
        </button>

        <h2>Client</h2>

        {menu.map(item => (
          <button
            key={item.key}
            className={page === item.key ? "active" : ""}
            onClick={() => {
              setPage(item.key);
              setOpen(false); // 🔥 ferme menu après clic
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="content">

        {page === "adresses" && (
          <div className="page">

            <h2> Mes adresses</h2>

            <div className="add-box">
              <input
                type="text"
                placeholder="Ajouter une adresse..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={addAddress}>
                <FaPlus />
              </button>
            </div>

            <div className="address-list">
              {addresses.map((addr, i) => (
                <div key={i} className="card">

                  <div className="left">
                    <FaMapMarkerAlt />
                    <span>{addr}</span>
                  </div>

                  <FaTrash
                    className="delete"
                    onClick={() => deleteAddress(i)}
                  />

                </div>
              ))}
            </div>

          </div>
        )}

        {page === "favoris" && <h2>Favoris</h2>}
        {page === "activite" && <h2>Activité récente</h2>}

      </div>

    </div>
  );
};

export default Dashboard;