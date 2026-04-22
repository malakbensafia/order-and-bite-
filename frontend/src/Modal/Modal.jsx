import React, { useState } from "react";
import "./Modal.css";

const Modal = ({ setShowModal }) => {
  const [step, setStep] = useState("mode");

  return (
    <div className="modal">
      <div className="modal-content">

        {/* STEP 1 */}
        {step === "mode" && (
          <>
            <h3>Choisissez un mode</h3>

            <div className="btn-row">
              <button>Livraison</button>

              <button onClick={() => setStep("reservation")}>
                Réservation
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === "reservation" && (
          <>
            <h3>Réservation</h3>

            <div className="btn-row">
              <button onClick={() => setStep("with")}>
                Avec commande
              </button>

              <button onClick={() => setStep("without")}>
                Sans commande
              </button>
            </div>
          </>
        )}

        {/* STEP 3 - STOP (juste affichage) */}
        {step === "with" && (
          <>
            <h3>Réservation avec commande</h3>
          </>
        )}

        {step === "without" && (
          <>
            <h3>Réservation sans commande</h3>
          </>
        )}

        {/* fermer */}
        <button className="close-btn" onClick={() => setShowModal(false)}>
          Fermer
        </button>

      </div>
    </div>
  );
};

export default Modal;