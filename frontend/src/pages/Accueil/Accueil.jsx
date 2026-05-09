import './Accueil.css'
import Header from '../../components/Header/Header'
import CategoryList from '../../components/CategoryList/CategoryList'
import React, { useState } from 'react'
import PlatsPopulaire from '../../components/PlatsPopulaire/PlatsPopulaire'
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
        user={user}
      />

      {/* 👤 VISITEUR NON CONNECTÉ */}
      {!user && (
        <>
          <CategoryList
            category={category}
            setCategory={setCategory}
          />
          <PlatsPopulaire />
          <Services
            setShowLogin={setShowLogin}
            setRole={setRole}
            setRoleFixed={setRoleFixed}
            setAuthMode={setAuthMode}
            user={user}
          />
        </>
      )}

      {/*  UTILISATEUR CONNECTÉ */}
      {user && (
        <>
          <CategoryList
            category={category}
            setCategory={setCategory}
          />
          <Services
            setShowLogin={setShowLogin}
            setRole={setRole}
            setRoleFixed={setRoleFixed}
            setAuthMode={setAuthMode}
            user={user}
          />
        </>
      )}

    </div>
  )
}

export default Accueil