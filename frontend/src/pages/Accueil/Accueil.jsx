import './Accueil.css'
import Header from '../../components/Header/Header'
import CategoryList from '../../components/CategoryList/CategoryList'
import React, { useState } from 'react'
import DisplayFood from '../DisplayFood/DisplayFood'
import Services from '../../components/Services/Services'

const Accueil = ({
  setShowLogin,
  setRole,
  setRoleFixed,
  setAuthMode,
  user
}) => {

  const [category, setCategory] = useState("Tout")

  return (
    <div className='accueil'>

      <Header
        setShowLogin={setShowLogin}
        setRole={setRole}
        setAuthMode={setAuthMode}
        setRoleFixed={setRoleFixed}
      />

      <CategoryList
        category={category}
        setCategory={setCategory}
      />

      <DisplayFood category={category} />

      <Services
        user={user}
        setShowLogin={setShowLogin}
        setRole={setRole}
        setRoleFixed={setRoleFixed}
        setAuthMode={setAuthMode}
      />

    </div>
  )
}

export default Accueil