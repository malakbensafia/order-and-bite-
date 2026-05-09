import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StoreContext } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import { passerReservation } from '../../api/reservationApi'
import ClientNavbar from '../../components/ClientNavbar/ClientNavbar'
import { FaCheckCircle } from "react-icons/fa"
import './PlaceOrderReservation.css'

const stripePromise = loadStripe("pk_test_51TUnNa2YCFjFK1i16x5S0PkJ1oq6QztHhDOXCoHUtOSX73bCDd2deMjAyIDeiitkjAGsxZ1TBzimB21TuojAQecV00L9aP8PDa")

const SuccessModal = ({ onClose }) => (
    <div className="modal-overlay">
        <div className="modal-card">
            <div className="modal-icon">
                <FaCheckCircle color="green" size={24} />
            </div>
            <h2>Réservation confirmée !</h2>
            <p>Votre acompte a été payé.<br />Vous recevrez un rappel le jour J.</p>
            <button className="modal-btn" onClick={onClose}>
                Retour à l'accueil
            </button>
        </div>
    </div>
)

const CheckoutForm = ({ acompte, totalPanier, panier, formData, selectedTable, onSuccess }) => {
    const stripe = useStripe()
    const elements = useElements()

    // ✅ CORRECTION 1 : user vient de useAuth, pas de StoreContext
    const { user } = useAuth()
    const { clearCart } = useContext(StoreContext)

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // ✅ Log de diagnostic
        console.log("user:", user)
        console.log("selectedTable:", selectedTable)
        console.log("panier:", panier)
        console.log("formData:", formData)

        if (!stripe || !elements) return
        if (!user) {
            setMessage("Utilisateur non connecté.")
            return
        }

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
            setMessage("Paiement non confirmé.")
            setLoading(false)
            return
        }

        const result = await passerReservation({
            idclient: user.idutilisateur,
            idadmin: 7,
            idtable: selectedTable.idtable,
            formData,
            nbrpersonnes: selectedTable.capacitetable,
            panier,
            acompte,
            totalPanier
        })

        if (result?.error) {
            setMessage(result.error)
            setLoading(false)
            return
        }

        // ✅ CORRECTION 2 : vider le panier + nettoyer sessionStorage
        clearCart()
        sessionStorage.removeItem("reservationState")

        onSuccess()
        setLoading(false)
    }

    return (
        <div className="stripe-card">
            <form onSubmit={handleSubmit}>
                <PaymentElement />
                <button disabled={!stripe || loading}>
                    {loading ? "Traitement en cours..." : `Payer l'acompte — ${acompte} DA`}
                </button>
                {message && <p className="payment-message">{message}</p>}
            </form>
        </div>
    )
}

const PlaceOrderReservation = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { panier, totalPanier, formData, selectedTable } = location.state || {}

    const [clientSecret, setClientSecret] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const acompte = Math.round((totalPanier || 0) * 0.25)
    const reste = (totalPanier || 0) - acompte

    const initierPaiement = async () => {
        const montant = Math.round(acompte * 100)
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
        else console.error("Erreur création payment intent:", data)
    }

    return (
        <div className="place-order-wrapper">

            {showModal && (
                <SuccessModal onClose={() => {
                    setShowModal(false)
                    navigate("/")
                }} />
            )}

            <ClientNavbar />

            <div className="placeorder-hero">
                <div className="hero-overlay">
                    <h1>Paiement acompte</h1>
                    <p>Payez 25% pour confirmer votre réservation</p>
                </div>
            </div>

            <div className="place-order">

                <div className="order-summary-card">
                    <h3>Récapitulatif réservation</h3>
                    <div className="summary-row">
                        <span>Table</span>
                        <span>{selectedTable?.numtable}</span>
                    </div>
                    <div className="summary-row">
                        <span>Date</span>
                        <span>{formData?.date}</span>
                    </div>
                    <div className="summary-row">
                        <span>Heure</span>
                        <span>{formData?.heure}</span>
                    </div>

                    {panier?.length > 0 && (
                        <>
                            <hr />
                            <h4>Précommande</h4>
                            {panier.map((item) => (
                                <div key={item.idplat} className="summary-row">
                                    <span>{item.nomplat} ×{item.quantite}</span>
                                    <span>{item.prix * item.quantite} DA</span>
                                </div>
                            ))}
                        </>
                    )}

                    <hr />
                    <div className="summary-row">
                        <span>Total précommande</span>
                        <span>{totalPanier} DA</span>
                    </div>
                    <div className="summary-row">
                        <span>Acompte à payer (25%)</span>
                        <span><b>{acompte} DA</b></span>
                    </div>
                    <div className="summary-row">
                        <span>Reste à payer sur place</span>
                        <span>{reste} DA</span>
                    </div>
                </div>

                {!clientSecret ? (
                    <button className="btn-pay-init" onClick={initierPaiement}>
                        Procéder au paiement de l'acompte
                    </button>
                ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm
                            acompte={acompte}
                            totalPanier={totalPanier}
                            panier={panier}
                            formData={formData}
                            selectedTable={selectedTable}
                            onSuccess={() => setShowModal(true)}
                        />
                    </Elements>
                )}

            </div>
        </div>
    )
}

export default PlaceOrderReservation