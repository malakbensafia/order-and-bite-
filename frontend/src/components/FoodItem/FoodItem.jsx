import React from 'react'
import './FoodItem.css'
import StarRating from '../StarRating/StarRating'

const FoodItem = ({ id, name, price, description, image }) => {
  return (
    <div className='food-item'>

      {/* IMAGE */}
      <div className="food-item-img-container">
        <img className='food-item-image' src={image} alt={name} />
      </div>

      
      <div className="food-item-info">

        <div className="food-item-header">
          <p className="food-item-name">{name}</p>
        </div>

        <p className="food-item-desc">{description}</p>

        <div className="food-item-footer">
          <p className="food-item-price"> {price}DA</p>

          <StarRating onRate={(value) => console.log(id, value)} />
        </div>

      </div>

    </div>
  )
}

export default FoodItem