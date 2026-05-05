import React, { useState } from "react"
import "./Modal.css"
import { useNavigate } from "react-router-dom"

const Modal = ({ setShowModal, setShowLogin }) => {
  const [step, setStep] = useState("mode")
  const navigate = useNavigate()

  // 🔥 check user connecté
  const getUser = () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  const handleAction = (path) => {
    const user = getUser()

    // ❌ pas connecté → login
    if (!user) {
      setShowLogin(true)
      setShowModal(false)
      return
    }

    // ✅ connecté → navigation
    navigate(path)
    setShowModal(false)
  }

  return (
    <div className="modal">
      <div className="modal-content">

        {step === "mode" && (
          <>
            <h3>Choisissez un mode</h3>

            <div className="btn-row">

              {/* LIVRAISON */}
              <button onClick={() => handleAction('/livraison')}>
                Livraison
              </button>

              {/* RESERVATION */}
              <button onClick={() => setStep("reservation")}>
                Réservation
              </button>

            </div>
          </>
        )}

        {step === "reservation" && (
          <>
            <h3>Réservation</h3>

            <div className="btn-row">

              <button onClick={() => handleAction('/reservation')}>
                Avec commande
              </button>

              <button onClick={() => handleAction('/reservation')}>
                Sans commande
              </button>

            </div>
          </>
        )}

        <button className="close-btn" onClick={() => setShowModal(false)}>
          Fermer
        </button>

      </div>
    </div>
  )
}

export default Modal