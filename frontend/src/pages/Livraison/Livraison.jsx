
import CategoryList from '../../components/CategoryList/CategoryList'
import DisplayFood from '../DisplayFood/DisplayFood'
import { StoreContext } from '../../context/StoreContext'
import './Livraison.css'
import React, { useState, useEffect, useContext } from 'react'
const Livraison = () => {

  const [category, setCategory] = useState("Tout")
  const { cartItems, getTotalCartAmount, setModePanier } = useContext(StoreContext)

  useEffect(() => {
    setModePanier("livraison"); // 👈 AJOUTE ÇA
  }, []);

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
         

         

         
        </div>

      </div>
    </div>
  )
}

export default Livraison