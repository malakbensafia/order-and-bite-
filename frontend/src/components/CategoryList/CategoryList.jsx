import React from 'react'
import './CategoryList.css'
import { menu_list } from '../../assets/assets'

const CategoryList = ({category,setCategory}) => {
  return (
    <div className='categories' id='categories'>
        <h1>Explorer nos catégories</h1>
        <p className='categories-text'>Choisissez parmi un menu varié proposant une délicieuse sélection de plats. Notre mission est de satisfaire vos envies et de vous offrir la meilleure expérience culinaire.</p>
        <div className="categories-list">
            {menu_list.map((item,index)=>{
                return(
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"Tout":item.menu_name)} key={index} className='categories-list-item'>
                        <img className={category===item.menu_name?"active":""}src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>

                    </div>

                    
                )
            })}
        </div>
        <hr/>


      
    </div>
    
    
  )
}

export default CategoryList
