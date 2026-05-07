import React, { useContext, useState } from 'react'
import './FoodItem.css'
import StarRating from '../StarRating/StarRating'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { FaPlus } from "react-icons/fa";
import { getImageSrc } from "../../outils/getImageSrc";

import {
  getFinalPrice,
  isPromoActive,
  getPromoBadgeImage
} from "../../outils/promotion";

const FoodItem = ({ id, name, description, image, item }) => {

  const [showMore, setShowMore] = useState(false)
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)

  if (!item) return null;


  const itemId = String(id);


  const promo = item?.promotionplat?.[0] || null;
  const active = promo && isPromoActive(promo);
  const badge = active ? getPromoBadgeImage(promo) : null;

  const finalPrice = getFinalPrice(item);


  const LIMIT = 80;
  const safeDesc = description || "";
  const isLong = safeDesc.length > LIMIT;

  const shortText = isLong
    ? safeDesc.substring(0, LIMIT).split(" ").slice(0, -1).join(" ") + "..."
    : safeDesc;

  // CART
  const quantity = cartItems[itemId] ?? 0;

  return (
    <div className='food-item'>

      <div className="food-item-img-container">
        <img
          className='food-item-image'
          src={getImageSrc(item.image_name)}
          alt={name}
        />


        {/* BADGE PROMO */}
        {active && badge && (
          <div className="promo-badge">
            <img src={badge} alt="promo" />
          </div>
        )}

        {/* ADD TO CART */}
        {quantity === 0 ? (
          <div className="add" onClick={() => addToCart(itemId)}>
            <FaPlus color="white" size={18} />
          </div>
        ) : (
          <div className="food-item-counter">

            <img
              onClick={() => removeFromCart(itemId)}
              src={assets.remove}
              alt="remove"
            />

            <p>{quantity}</p>

            <img
              onClick={() => addToCart(itemId)}
              src={assets.addgreen}
              alt="add"
            />

          </div>
        )}

      </div>

      <div className="food-item-info">

        <p className="food-item-name">{name}</p>

        <p className="food-item-desc">
          {showMore ? description : shortText}
        </p>

        {isLong && (
          <span
            className="see-more"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Voir moins" : "Voir plus"}
          </span>
        )}

        {/* PRICE */}
        <div className="food-item-footer">

          {active ? (
            <div>
              <span className="old-price">
                {item.prix} DA
              </span>

              <span className="new-price">
                {finalPrice} DA
              </span>
            </div>
          ) : (
            <p className="food-item-price">{item.prix} DA</p>
          )}

          <StarRating onRate={(value) => console.log(itemId, value)} />

        </div>

      </div>

    </div>
  )
}

export default FoodItem