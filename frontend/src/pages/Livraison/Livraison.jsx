import CategoryList from '../../components/CategoryList/CategoryList'
import DisplayFood from '../DisplayFood/DisplayFood'
import AvisSection from '../../components/AvisSection/AvisSection'
import { StoreContext } from '../../context/StoreContext'
import './Livraison.css'
import React, { useState, useEffect, useContext } from 'react'
import { FaComments } from "react-icons/fa"; // 👈

const Livraison = () => {

  const [category, setCategory] = useState("Tout")
  const [platSelectionne, setPlatSelectionne] = useState(() => {
    const saved = localStorage.getItem("platSelectionne")
    return saved ? JSON.parse(saved) : null
  })

  const { setModePanier } = useContext(StoreContext)

  useEffect(() => {
    setModePanier("livraison");
  }, []);

  const handleSelectPlat = (plat) => {
    setPlatSelectionne(plat)
    localStorage.setItem("platSelectionne", JSON.stringify(plat))
  }

  return (
    <div className="livraison-page">

      <div className="livraison-hero">
        <h1>Livraison rapide</h1>
      </div>

      <div className="livraison-content">
        <CategoryList category={category} setCategory={setCategory} />
        <DisplayFood category={category} onSelectPlat={handleSelectPlat} />
        <div className="livraison-cart"></div>
      </div>

      {/* SECTION COMMENTAIRES EN BAS */}
      <div id="section-commentaires" className="livraison-avis">
        <h2><FaComments /> Commentaires</h2> 
        <AvisSection idplat={platSelectionne?.id || null} />
      </div>

    </div>
  )
}

export default Livraison