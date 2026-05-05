import React, { useContext } from 'react'
import './DisplayFood.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
const DisplayFood = ({category}) => {
    const {food_list} =useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Plats populaires près de chez vous</h2>
      <div className="food-display-list">
        {food_list.map((item,index)=>{
          if (category==="Tout" || category===item.category) {
             return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
            
          }

           
        })}
      </div>
    </div>
  )
}

export default DisplayFood
