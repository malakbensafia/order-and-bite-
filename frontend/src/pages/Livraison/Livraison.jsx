import React, { useState, useContext } from 'react';
import CategoryList from '../../components/CategoryList/CategoryList';
import DisplayFood from '../DisplayFood/DisplayFood';
import { StoreContext } from '../../context/StoreContext';
import './Livraison.css';

const Livraison = () => {

  const [category, setCategory] = useState("Tout");
  const { cartItems, food_list, getTotalCartAmount } = useContext(StoreContext);

  return (
    <div className="livraison-page">

      {/* HERO */}
      <div className="livraison-hero">
        <div className="livraison-hero-overlay">
          <h1>Livraison rapide à domicile</h1>
          <p>Choisissez vos plats préférés et commandez facilement</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="livraison-content">

        <CategoryList category={category} setCategory={setCategory} />

        <DisplayFood category={category} />

        <div className="livraison-cart">
          <h2>Votre panier</h2>

          {food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id} className="cart-item">
                  <p>{item.name}</p>
                  <p>{cartItems[item._id]} x {item.price} DA</p>
                  <p>Total : {cartItems[item._id] * item.price} DA</p>
                </div>
              );
            }
            return null;
          })}

          <hr />
          <h3>Total : {getTotalCartAmount()} DA</h3>
        </div>

      </div>
    </div>
  );
};

export default Livraison;