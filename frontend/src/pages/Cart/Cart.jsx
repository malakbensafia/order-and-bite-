import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { imagesMap } from '../../assets/assets'
import { getFinalPrice } from '../../outils/promotion'
import { getImageSrc } from "../../outils/getImageSrc";
const Cart = () => {

  const { cartItems, plats, removeFromCart, getTotalCartAmount } = useContext(StoreContext);





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

                  <img
                    src={getImageSrc(item.image_name)}
                    alt={item.nomplat}
                  />

                  <p>{item.nomplat}</p>

                  <div className="cart-price">

                    {hasPromo ? (
                      <>
                        <span className="old-price">
                          {item.prix} DA
                        </span>

                        <span className="new-price">
                          {finalPrice} DA
                        </span>
                      </>
                    ) : (
                      <span>
                        {item.prix} DA
                      </span>
                    )}

                  </div>

                  <p>{quantity}</p>

                  <p>{finalPrice * quantity} DA</p>

                  <p
                    onClick={() => removeFromCart(item.idplat)}
                    className='cross'
                  >
                    x
                  </p>

                </div>

                <hr />

              </div>
            )
          }

          return null;
        })}

      </div>

      <div className="cart-bottom">

        <div className="cart-total">

          <h2>Total de panier</h2>

          <div>

            <div className="cart-total-details">
              <p>Sous-total</p>
              <p>{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Frais de livraison</p>
              <p>2</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() + 2}</b>
            </div>

          </div>

          <button>Passer à la commande</button>

        </div>

        <div className="cart-promocode">
          <div>
            <p>Si vous avez un code promo, saisissez-le ici</p>

            <div className='cart-promocode-input'>
              <input type="text" placeholder='promocode' />
              <button>Valider</button>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default Cart