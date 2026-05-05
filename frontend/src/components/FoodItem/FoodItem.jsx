import React, { useContext,useState} from 'react'
import './FoodItem.css'
import StarRating from '../StarRating/StarRating'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

  const [showMore, setShowMore] = useState(false)

  const {cartItems,addToCart,removeFromCart}=useContext(StoreContext);

  const LIMIT = 80
  const safeDesc = description || ""
 const isLong = safeDesc.length > LIMIT
  
  const shortText = isLong
  ? safeDesc.substring(0, LIMIT).split(" ").slice(0, -1).join(" ") + "..."
  : safeDesc
 
  


  return (
    <div className='food-item'>

      <div className="food-item-img-container">
        <img className='food-item-image' src={image} alt={name}   loading="lazy" decoding="async" />
        {!cartItems[id]
        ?<img className='add' onClick={()=>addToCart(id)} src={assets.plus} alt=""/>
        :<div className="food-item-counter">
          

        </div>


        }
      </div>
      <div className="food-item-info">

  <div className="food-item-header">
    <p className="food-item-name">{name}</p>
    {!cartItems?.[id]

    ?<img className="add"onClick={() => addToCart(id)} src={assets.plus}  alt=""/>
    :<div className="food-item-counter">
      <img onClick={()=>removeFromCart(id)} src={assets.remove} alt=""/>
      <p>{cartItems?.[id] || 0}</p>
      <img onClick={()=>addToCart(id)} src={assets.addgreen} alt=""/>
    </div>

      
    }
      
     
      
  </div>
  

  <p className="food-item-desc">
    {showMore ? description : shortText}
  </p>

  {isLong && (
    <span className="see-more" onClick={() => setShowMore(!showMore)}>
      {showMore ? "Voir moins" : "Voir plus"}
    </span>
  )}

  <div className="food-item-footer">
    <p className="food-item-price">{price} DA</p>
    <StarRating onRate={(value) => console.log(id, value)} />
  </div>

</div>

      
    </div>
  )
}

export default FoodItem