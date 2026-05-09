import React, { useEffect, useState } from 'react'
import './DisplayFood.css'
import FoodItem from '../../components/FoodItem/FoodItem'
import supabase from '../../api/supabaseClient'
import { imagesMap } from '../../assets/assets'

const DisplayFood = ({ category, onSelectPlat }) => {

  const [plats, setPlats] = useState([])

  useEffect(() => {

    const fetchPlats = async () => {

      const { data, error } = await supabase
        .from("plat")
        .select(`
          *,
          promotionplat (
            idpromoplat,
            idplat,
            tauxreduction,
            datedebutpromo,
            datefinpromo
          )
        `);

      if (error) {
        console.error("Erreur chargement plats :", error)
        return
      }

      setPlats(data || [])
    }

    fetchPlats()

  }, [])

  return (
    <div className='food-display' id='food-display'>

      <h2>Nos plats</h2>

      <div className="food-display-list">

        {plats
          .filter(item =>
            category === "Tout" ||
            item.categorie?.trim().toLowerCase() === category.trim().toLowerCase()
          )
          .map((item) => {

            const key = item.image_name?.replace(/[\r\n\t]/g, '').trim()

            const image =
              !key
                ? null
                : key.startsWith("http")
                  ? key
                  : imagesMap[key]

            return (
              <FoodItem
                key={item.idplat}
                id={item.idplat}
                name={item.nomplat}
                description={item.description}
                image={image}   
                item={item}
                onSelectPlat={onSelectPlat}
              />
            )
          })
        }

      </div>

    </div>
  )
}

export default DisplayFood