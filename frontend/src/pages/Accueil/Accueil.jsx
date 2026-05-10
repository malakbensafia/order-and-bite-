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

      {!user && (
        <>
          <CategoryList category={category} setCategory={setCategory} />
          <PlatsPopulaire />
          <div id="services">
            <Services
              setShowLogin={setShowLogin}
              setRole={setRole}
              setRoleFixed={setRoleFixed}
              setAuthMode={setAuthMode}
              user={user}
            />
          </div>
        </>
      )}

      {user && (
        <>
          <CategoryList category={category} setCategory={setCategory} />
          <div id="services">
            <Services
              setShowLogin={setShowLogin}
              setRole={setRole}
              setRoleFixed={setRoleFixed}
              setAuthMode={setAuthMode}
              user={user}
            />
          </div>
        </>
      )}

    </div>
  )
}

export default Accueil