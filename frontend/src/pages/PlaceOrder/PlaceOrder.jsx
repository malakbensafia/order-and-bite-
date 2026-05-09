import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StoreContext } from '../../context/StoreContext'
import { passerCommande } from '../../api/commandeApi'
import ClientNavbar from '../../components/ClientNavbar/ClientNavbar'
import './PlaceOrder.css'
import { FaCheckCircle } from "react-icons/fa";

const stripePromise = loadStripe("pk_test_51TUnNa2YCFjFK1i16x5S0PkJ1oq6QztHhDOXCoHUtOSX73bCDd2deMjAyIDeiitkjAGsxZ1TBzimB21TuojAQecV00L9aP8PDa")

// ───────── MODAL ─────────
const SuccessModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-card">
      <div className="modal-icon">
        <FaCheckCircle color="green" size={24} />
      </div>
      <h2>Paiement confirmé !</h2>
      <p>Votre commande a bien été enregistrée.<br />Nous préparons votre repas.</p>
      <button className="modal-btn" onClick={onClose}>
        Retour à l'accueil
      </button>
    </div>
  </div>
)

// ───────── FORM ─────────
const CheckoutForm = ({ fraisLivraison, adresseChoisie, adminCoords, codePromo, reduction, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { cartItems, plats, getTotalCartAmount, user, clearCart } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      setMessage("Paiement non confirmé")
      setLoading(false)
      return
    }

    const result = await passerCommande({
      idclient: user.idutilisateur,
      idadmin: adminCoords.idutilisateur,
      adresseChoisie,
      cartItems,
      plats,
      fraisLivraison,
      prixtotal: getTotalCartAmount(),
      idcodepromo: codePromo?.idcodepromo || null  // ✅
    })

    if (result?.error) {
      setMessage(result.error)
      setLoading(false)
      return
    }

    await clearCart()
    onSuccess()
    setLoading(false)
  }

  return (
    <div className="stripe-card">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button disabled={!stripe || loading}>
          {loading ? "Traitement en cours..." : "Confirmer le paiement"}
        </button>
        {message && <p className="payment-message">{message}</p>}
      </form>
    </div>
  )
}

// ───────── PAGE ─────────
const PlaceOrder = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // ✅ ajoute codePromo et reduction
  const { fraisLivraison, adresseChoisie, adminCoords, codePromo, reduction } = location.state || {}
  const { getTotalCartAmount } = useContext(StoreContext)
  const [clientSecret, setClientSecret] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const sousTotal = getTotalCartAmount()
  const reductionVal = reduction || 0
  // ✅ total avec réduction
  const total = sousTotal + (fraisLivraison || 0) - reductionVal

  const initierPaiement = async () => {
    const montant = Math.round(total * 100)
    const res = await fetch(
      "https://mmwwqufyttcrjyyxyebh.supabase.co/functions/v1/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: montant })
      }
    )
    const data = await res.json()
    if (data?.clientSecret) setClientSecret(data.clientSecret)
  }

  const handleSuccess = () => setShowModal(true)

  const handleCloseModal = () => {
    setShowModal(false)
    navigate("/")
  }

  return (
    <div className="place-order-wrapper">

      {showModal && <SuccessModal onClose={handleCloseModal} />}

      <ClientNavbar />

      <div className="placeorder-hero">
        <div className="hero-overlay">
          <h1>Finaliser la commande</h1>
          <p>Vérifiez votre commande et procédez au paiement</p>
        </div>
      </div>

      <div className="place-order">

        <div className="order-summary-card">
          <h3>Récapitulatif</h3>
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{sousTotal} DA</span>
          </div>
          <div className="summary-row">
            <span>Frais de livraison</span>
            <span>{fraisLivraison || 0} DA</span>
          </div>
          {/* ✅ réduction */}
          {codePromo && (
            <div className="summary-row" style={{ color: "green" }}>
              <span>Réduction ({codePromo.code})</span>
              <span>-{reductionVal} DA</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>{total} DA</span>
          </div>
        </div>

        {!clientSecret ? (
          <button className="btn-pay-init" onClick={initierPaiement}>
            Procéder au paiement
          </button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              fraisLivraison={fraisLivraison}
              adresseChoisie={adresseChoisie}
              adminCoords={adminCoords}
              codePromo={codePromo}
              reduction={reductionVal}
              onSuccess={handleSuccess}
            />
          </Elements>
        )}

      </div>
    </div>
  )
}

export default PlaceOrder