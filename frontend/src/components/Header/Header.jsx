import React, { useState } from 'react'
import './Header.css'
import Modal from '../../Modal/Modal'
const Header = () => {
     const [showModal, setShowModal] = useState(false);
  return (
    <div className='header'>
      <div className="header-contents">
      <h2>Commandez ici vos plats préférés</h2>
        <button onClick={() => setShowModal(true)}>
          Explorer Menu
        </button>
      </div>
       {showModal && <Modal setShowModal={setShowModal} />}
    </div>
  )
}

export default Header
