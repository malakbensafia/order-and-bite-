import React, { useState, useContext } from 'react'
import CategoryList from '../../components/CategoryList/CategoryList'
import DisplayFood from '../DisplayFood/DisplayFood'
import { StoreContext } from '../../context/StoreContext'
import './Livraison.css'

const Livraison = () => {

  const [category, setCategory] = useState("Tout")
  const { cartItems, getTotalCartAmount } = useContext(StoreContext)

  return (
    <div className="livraison-page">

      <div className="livraison-hero">
        <h1>Livraison rapide</h1>
      </div>

      <div className="livraison-content">

        <CategoryList
          category={category}
          setCategory={setCategory}
        />

        {/* 🔥 UNE SEULE SOURCE */}
        <DisplayFood category={category} />

        <div className="livraison-cart">
          <h2>Panier</h2>

          {Object.keys(cartItems).map(id => (
            cartItems[id] > 0 && (
              <div key={id}>
                <p>{id}</p>
                <p>{cartItems[id]} articles</p>
              </div>
            )
          ))}

          <h3>Total: {getTotalCartAmount()} DA</h3>
        </div>

      </div>
    </div>
  )
}

export default Livraison