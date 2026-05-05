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

  // 🔥 protection simple
  const handleServicesClick = () => {
    if (!user) {
      setAuthMode("Se connecter")
      setShowLogin(true)
      return
    }

    // sinon laisser Services gérer modal
  }

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

      <PlatsPopulaire />

      <Services
        user={user}
        onRequireAuth={handleServicesClick}
        setShowLogin={setShowLogin}
        setRole={setRole}
        setRoleFixed={setRoleFixed}
        setAuthMode={setAuthMode}
      />
    </div>
  )
}

export default Accueil