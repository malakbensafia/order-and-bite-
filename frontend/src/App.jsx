import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes,Route } from 'react-router-dom'
import Accueil from './pages/Accueil/Accueil'
import FooterSection from './components/FooterSection/FooterSection'
import Livraison from './pages/Livraison/Livraison'
const App = () => {
  return (
    <>
    <div className='app'>
      <Navbar/>
      
      <Routes>
        <Route path='/' element={<Accueil/>}/>
        <Route path='/livraison' element={<Livraison/>}/>
        
      </Routes>
       
      
    </div>
    <FooterSection />
    
</>
    
    
 
  )
}

export default App
