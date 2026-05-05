import React, { useEffect, useState } from 'react'
import './DisplayFood.css'
import FoodItem from '../../components/FoodItem/FoodItem'
import supabase from '../../api/supabaseClient'
import { imagesMap } from '../../assets/assets'

const DisplayFood = ({ category }) => {

  const [plats, setPlats] = useState([])
  console.log("PLATS 👉", plats)
console.log("CATEGORY 👉", category)

  useEffect(() => {
    const fetchPlats = async () => {
      const { data, error } = await supabase
        .from("plat")
        .select("*")

      if (!error) {
        setPlats(data || [])
      }
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

            // 🔥 IMAGE DIRECTE (PAS assets)
            const imageUrl = `/images/${item.image_name}`
           console.log("ITEM 👉", item)
console.log("categorie DB 👉", item.categorie)
console.log("image_name 👉", item.image_name)
            return (
              <FoodItem
                key={item.idplat}
                id={item.idplat}
                name={item.nomplat}
                description={item.description}
                price={item.prix}
                 image={imagesMap[item.image_name]}
              />
            )
          })}

      </div>
    </div>
  )
}

export default DisplayFood