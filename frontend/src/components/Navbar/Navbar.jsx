import React, { useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'


const Navbar = () => {

    const[menu,setMenu]=useState("Accueil");


  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className="logo" />
        <ul className="navbar-menu">
            <li onClick={()=>setMenu("Accueil")} className={menu==="Accueil"?"active":""}>Accueil</li>
            <li onClick={()=>setMenu("Nos services")}className={menu==="Nos services"?"active":""}>Nos services</li>
            <li onClick={()=>setMenu("A propos")}className={menu==="A propos"?"active":""}>A propos</li>
            <li onClick={()=>setMenu("Installer pwa")}className={menu==="Installer pwa"?"active":""}>Installer pwa</li>
            
        </ul>

        <div className="navbar-right">
            <div  className="cart-wrapper">
           <img src={assets.cart} alt="" className="cart"/>
           <div className="dot"></div>
           </div>
            <button className="navbar-button">S'inscrire</button>
        </div>
      
    </div>
  )
}

export default Navbar
