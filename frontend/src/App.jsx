import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Accueil from "./pages/Accueil/Accueil";
import Livraison from "./pages/Livraison/Livraison";
import Cart from "./pages/Cart/Cart";
import Reservation from "./pages/Reservation/Reservation";
import Admin from "./pages/Admin/Admin";
import EspaceClient from "./pages/EspaceClient/EspaceClient";
import LoginPopup from "./components/LoginPopup/LoginPopup";

import PublicLayout from "./layouts/PublicLayout";
import ClientLayout from "./layouts/ClientLayout";
import Livreur from "./pages/Livreur/Livreur";
import ResePrecommande from "./pages/ResePrecommande/ResePrecommande";


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [roleFixed, setRoleFixed] = useState(false);
  const [authMode, setAuthMode] = useState("S'inscrire");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      {/* LOGIN POPUP */}
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          role={role}
          setRole={setRole}
          roleFixed={roleFixed}
          authMode={authMode}
        />
      )}

      <div className="app">

        <Routes>


          <Route
            path="/"
            element={
              <PublicLayout
                setShowLogin={setShowLogin}
                setRole={setRole}
                setRoleFixed={setRoleFixed}
                setAuthMode={setAuthMode}
              >
                <Accueil
                  setShowLogin={setShowLogin}
                  setRole={setRole}
                  setRoleFixed={setRoleFixed}
                  setAuthMode={setAuthMode}
                  user={user}
                />
              </PublicLayout>
            }
          />

          <Route
            path="/livraison"
            element={
              <ClientLayout transparent={true}>
                <Livraison />
              </ClientLayout>
            }
          />

          <Route
            path="/cart"
            element={
              <ClientLayout >
                <Cart />
              </ClientLayout>
            }
          />
          <Route
            path="/reservation"
            element={
              <ClientLayout hideCart={true} transparent={true}>
                <Reservation />
              </ClientLayout>
            }
          />

          <Route
            path="/client"
            element={
              <ClientLayout transparent={true}>
                <EspaceClient />
              </ClientLayout>
            }
          />
          <Route path="/admin" element={
            <ClientLayout transparent={true} hideCart={true}  >
              <Admin />
            </ClientLayout>
          } />
          <Route path="/livreur" element={
            <ClientLayout transparent={true} hideCart={true}  >
              <Livreur />

            </ClientLayout>

          }/>
          <Route path="/respre" element={
            <ClientLayout transparent={true} hideCart={true}>
              <ResePrecommande/>

            </ClientLayout>
          }/>
          

          


        </Routes>

      </div>
    </>
  );
};

export default App;