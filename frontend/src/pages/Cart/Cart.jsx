import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { getFinalPrice } from '../../outils/promotion'
import { getImageSrc } from '../../outils/getImageSrc'
import { loadAddresses, loadAdminCoords } from '../../api/adresseApi'
import { calculerDistance, calculerFraisLivraison } from '../../outils/distance'
import { validerCodePromo } from '../../api/codePromoApi'
import { getPoints, utiliserPoints } from '../../api/fideliteApi' // 👈 AJOUTÉ

const Cart = () => {
  const { cartItems, plats, removeFromCart, getTotalCartAmount, user, modePanier } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [adresses, setAdresses] = useState([]);
  const [adresseChoisie, setAdresseChoisie] = useState(null);
  const [fraisLivraison, setFraisLivraison] = useState(0);
  const [distanceKm, setDistanceKm] = useState(null);
  const [adminCoords, setAdminCoords] = useState(null);

  const [codeInput, setCodeInput] = useState("");
  const [codePromo, setCodePromo] = useState(null);
  const [codeErreur, setCodeErreur] = useState("");

  // 👇 AJOUTÉ
  const [pointsDisponibles, setPointsDisponibles] = useState(0);
  const [pointsUtilises, setPointsUtilises] = useState(false);
  const [reductionPoints, setReductionPoints] = useState(0);

  useEffect(() => {
    loadAdminCoords().then(setAdminCoords);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadAddresses(user.idutilisateur).then((data) => {
      setAdresses(data);
      if (data.length > 0) setAdresseChoisie(data[0]);
    });
    getPoints(user.idutilisateur).then(setPointsDisponibles); // 👈 AJOUTÉ
  }, [user]);

  useEffect(() => {
    if (adminCoords && adresseChoisie) choisirAdresse(adresseChoisie);
  }, [adminCoords, adresseChoisie]);

  const choisirAdresse = (adresse) => {
    setAdresseChoisie(adresse);
    if (!adminCoords) return;
    const lat = Number(adresse.latitudeadrs);
    const lon = Number(adresse.longitudeadrs);
    if (!lat || !lon) return;
    const dist = calculerDistance(lat, lon, Number(adminCoords.latitudeadmin), Number(adminCoords.longitudeadmin));
    setDistanceKm(dist.toFixed(1));
    setFraisLivraison(calculerFraisLivraison(dist));
  };

  const handleSelectChange = (e) => {
    const id = parseInt(e.target.value);
    const adresse = adresses.find((a) => a.idadrs === id);
    if (adresse) choisirAdresse(adresse);
  };

  const validerCode = async () => {
    setCodeErreur("");
    setCodePromo(null);
    if (!codeInput.trim()) { setCodeErreur("Veuillez saisir un code"); return; }
    const { data, error } = await validerCodePromo(codeInput);
    if (error) { setCodeErreur(error); return; }
    setCodePromo(data);
  };

  // 👇 AJOUTÉ
  const appliquerPoints = async () => {
    if (pointsDisponibles < 100) { alert("Minimum 100 points requis"); return; }
    const result = await utiliserPoints(user.idutilisateur);
    if (result.error) { alert(result.error); return; }
    const red = Math.round(getTotalCartAmount() * 0.10);
    setReductionPoints(red);
    setPointsUtilises(true);
    setPointsDisponibles(prev => prev - 100);
  };

  // 👇 AJOUTÉ
  const annulerPoints = () => {
    setPointsUtilises(false);
    setReductionPoints(0);
    setPointsDisponibles(prev => prev + 100);
  };

  const calculerReduction = () => {
    if (!codePromo) return 0;
    const sousTotal = getTotalCartAmount();
    if (codePromo.typereduction === "pourcentage") {
      return Math.round(sousTotal * codePromo.valeurreduction / 100);
    }
    return Math.min(Number(codePromo.valeurreduction), sousTotal);
  };

  const reduction = calculerReduction();
  const sousTotal = getTotalCartAmount();
  const totalFinal = sousTotal + fraisLivraison - reduction - reductionPoints; // 👈 MODIFIÉ

  const handleCommande = () => {
    if (!adresseChoisie) { alert("Veuillez choisir une adresse de livraison"); return; }
    navigate("/placeorder", {
      state: { fraisLivraison, adresseChoisie, adminCoords, codePromo, reduction, reductionPoints } // 👈 MODIFIÉ
    });
  };

  return (
    <div className='cart-item cart-page'>

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Plats</p>
          <p>Titre</p>
          <p>Prix</p>
          <p>Quantité</p>
          <p>Total</p>
          <p>Retirer</p>
        </div>
        <br />
        <hr />
        {plats.map((item) => {
          const quantity = cartItems[item.idplat];
          const finalPrice = getFinalPrice(item);
          const hasPromo = finalPrice !== Number(item.prix);
          if (quantity > 0) {
            return (
              <div key={item.idplat}>
                <div className='cart-items-title cart-items-item'>
                  <img src={getImageSrc(item.image_name)} alt={item.nomplat} />
                  <p>{item.nomplat}</p>
                  <div className="cart-price">
                    {hasPromo ? (
                      <>
                        <span className="old-price">{item.prix} DA</span>
                        <span className="new-price">{finalPrice} DA</span>
                      </>
                    ) : (
                      <span>{item.prix} DA</span>
                    )}
                  </div>
                  <p>{quantity}</p>
                  <p>{finalPrice * quantity} DA</p>
                  <p onClick={() => removeFromCart(item.idplat)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>

      {modePanier === "precommande" && (
        <button className="btn-back-menu-precommande" onClick={() => {
          const saved = JSON.parse(sessionStorage.getItem("reservationState") || "{}");
          navigate("/menu-precommande", { state: { selectedTable: saved.selectedTable, formData: saved.formData } });
        }}>
          ← Ajouter d'autres plats
        </button>
      )}

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total de panier</h2>

          {modePanier !== "precommande" && (
            <>
              <div className="cart-address-select">
                <p>Adresse de livraison</p>
                {adresses.length === 0 ? (
                  <p className="no-address">Aucune adresse enregistrée</p>
                ) : (
                  <select onChange={handleSelectChange} value={adresseChoisie?.idadrs || ''}>
                    {adresses.map((a) => (
                      <option key={a.idadrs} value={a.idadrs}>
                        {a.rue ? `${a.rue}, ${a.ville}` : `GPS — ${a.ville}`}
                      </option>
                    ))}
                  </select>
                )}
                {distanceKm && <small>{distanceKm} km du restaurant</small>}
              </div>

              <div>
                <div className="cart-total-details">
                  <p>Sous-total</p>
                  <p>{sousTotal} DA</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Frais de livraison</p>
                  <p>{fraisLivraison} DA</p>
                </div>

                {codePromo && (
                  <>
                    <hr />
                    <div className="cart-total-details" style={{ color: "green" }}>
                      <p>Réduction ({codePromo.code})</p>
                      <p>-{reduction} DA</p>
                    </div>
                  </>
                )}

                {/* 👇 AJOUTÉ */}
                {pointsUtilises && (
                  <>
                    <hr />
                    <div className="cart-total-details" style={{ color: "green" }}>
                      <p>Réduction fidélité (100 pts)</p>
                      <p>-{reductionPoints} DA</p>
                    </div>
                  </>
                )}

                <hr />
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>{totalFinal} DA</b>
                </div>
              </div>

              {/* 👇 AJOUTÉ — section points fidélité */}
              {user && (
                <div className="cart-fidelite">
                  <p> Points fidélité : <b>{pointsDisponibles} pts</b></p>
                  {pointsDisponibles >= 100 && !pointsUtilises && (
                    <button className="btn-utiliser-points" onClick={appliquerPoints}>
                      Utiliser 100 pts → -10% sur le total
                    </button>
                  )}
                  {pointsUtilises && (
                    <button className="btn-annuler-points" onClick={annulerPoints}>
                      ✕ Annuler la réduction fidélité
                    </button>
                  )}
                  {pointsDisponibles < 100 && (
                    <p className="points-insuffisants">
                      {100 - pointsDisponibles} pts manquants pour une réduction
                    </p>
                  )}
                </div>
              )}

            </>
          )}

          {modePanier === "precommande" && (
            <div>
              <div className="cart-total-details">
                <b>Total précommande</b>
                <b>{sousTotal} DA</b>
              </div>
            </div>
          )}

          {modePanier === "precommande" ? (
            <button onClick={() => {
              const saved = JSON.parse(sessionStorage.getItem("reservationState") || "{}");
              const panier = plats
                .filter(p => cartItems[String(p.idplat)] > 0)
                .map(p => ({ idplat: p.idplat, nomplat: p.nomplat, prix: getFinalPrice(p), quantite: cartItems[String(p.idplat)] }));
              navigate("/placeorder-reservation", {
                state: { selectedTable: saved.selectedTable, formData: saved.formData, panier, totalPanier: getTotalCartAmount() }
              });
            }}>
              Confirmer et payer →
            </button>
          ) : (
            <button onClick={handleCommande}>Passer à la commande</button>
          )}

        </div>

        <div className="cart-promocode">
          <div>
            <p>Si vous avez un code promo, saisissez-le ici</p>
            <div className='cart-promocode-input'>
              <input
                type="text"
                placeholder='Ex: ETE2025'
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodePromo(null); setCodeErreur(""); }}
              />
              <button onClick={validerCode}>Valider</button>
            </div>
            {codeErreur && <p style={{ color: "red", fontSize: 13, marginTop: 6 }}>{codeErreur}</p>}
            {codePromo && (
              <p style={{ color: "green", fontSize: 13, marginTop: 6 }}>
                 Code appliqué : -{reduction} DA
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart