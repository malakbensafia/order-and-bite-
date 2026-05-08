import React, { useContext, useState, useEffect } from 'react'
import './FoodItem.css'
import StarRating from '../StarRating/StarRating'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { FaPlus } from "react-icons/fa";
import { getImageSrc } from "../../outils/getImageSrc";
import { useAuth } from "../../context/AuthContext";
import { getFinalPrice, isPromoActive, getPromoBadgeImage } from "../../outils/promotion";
import { addAvis, updateMoyennePlat, getMoyennePlat } from "../../api/avisApi";
import supabase from "../../api/supabaseClient";

const FoodItem = ({ id, name, description, image, item }) => {

  const [showMore, setShowMore] = useState(false)
  const [moyenne, setMoyenne] = useState(0)
  const [avisList, setAvisList] = useState([])
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const moy = await getMoyennePlat(id)
      setMoyenne(moy)
      const { data } = await supabase
        .from("avis")
        .select("*")
        .eq("idplat", id)
        .order("dateavis", { ascending: false })
      setAvisList(data || [])
    }
    fetchData()
  }, [id])

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

  const quantity = cartItems[itemId] ?? 0;

  const handleRate = async (value) => {
    if (!user) { alert("Veuillez vous connecter"); return; }
    const commentaire = prompt("Votre commentaire")
    const avis = await addAvis({
      note: value,
      commentaire: commentaire || "",
      dateavis: new Date(),
      idclient: user.idutilisateur,
      idplat: itemId
    })
    if (!avis) { alert("Erreur ajout avis"); return; }
    await updateMoyennePlat(itemId)
    const moy = await getMoyennePlat(itemId)
    setMoyenne(moy)
    const { data } = await supabase
      .from("avis")
      .select("*")
      .eq("idplat", itemId)
      .order("dateavis", { ascending: false })
    setAvisList(data || [])
    alert("Avis ajouté ✅")
  }

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={getImageSrc(item.image_name)} alt={name} />

        {active && badge && (
          <div className="promo-badge">
            <img src={badge} alt="promo" />
          </div>
        )}

        {quantity === 0 ? (
          <div className="add" onClick={() => addToCart(itemId)}>
            <FaPlus color="white" size={18} />
          </div>
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(itemId)} src={assets.remove} alt="remove" />
            <p>{quantity}</p>
            <img onClick={() => addToCart(itemId)} src={assets.addgreen} alt="add" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <p className="food-item-name">{name}</p>
        <p className="food-item-desc">{showMore ? description : shortText}</p>
        {isLong && (
          <span className="see-more" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Voir moins" : "Voir plus"}
          </span>
        )}

        <div className="food-item-footer">
          {active ? (
            <div>
              <span className="old-price">{item.prix} DA</span>
              <span className="new-price">{finalPrice} DA</span>
            </div>
          ) : (
            <p className="food-item-price">{item.prix} DA</p>
          )}

          <div>
            <StarRating onRate={handleRate} />
            <p style={{ marginTop: "5px" }}>⭐ {moyenne}/5</p>
          </div>
        </div>

        <div className="avis-section">
          {avisList.map((avis) => (
            <div key={avis.idavis} style={{ marginTop: "10px", padding: "8px", borderTop: "1px solid #ddd" }}>
              <p>⭐ {avis.note}/5</p>
              <p>{avis.commentaire}</p>
              <small>Client : {avis.idclient}</small>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default FoodItem