
import CategoryList from '../../components/CategoryList/CategoryList'
import React, { useState } from 'react'
import DisplayFood from '../DisplayFood/DisplayFood';

const Livraison = () => {
    const[category,setCategory]=useState("Tout");
  return (
    <div>
        <CategoryList category={category} setCategory={setCategory}/>
        <DisplayFood/>
       
      
    </div>
  )
}

export default Livraison
