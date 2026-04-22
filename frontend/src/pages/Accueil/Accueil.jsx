
import './Accueil.css'
import Header from '../../components/Header/Header'
import CategoryList from '../../components/CategoryList/CategoryList'
import React, { useState } from 'react'
import PlatsPopulaire from '../../components/PlatsPopulaire/PlatsPopulaire'
import Services from '../../components/Services/Services'
import AppDownload from '../../components/AppDownload/AppDownload'




const Accueil = () => {
    const[category,setCategory]=useState("Tout");
  return (
    <div>
      <Header/>
      <CategoryList category={category} setCategory={setCategory}/>
      <PlatsPopulaire   />
      <Services/>
      <AppDownload/>
  
      
    </div>
  )
}

export default Accueil
