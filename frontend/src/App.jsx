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
import ProtectedRoute from "./routes/ProtectedRoute"
import { useAuth } from "./context/AuthContext"
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Notifications from "./pages/Notifications/Notifications";
import MenuPrecommande from "./pages/MenuPrecommande/MenuPrecommande";

import PlaceOrderReservation from "./pages/PlaceOrderReservation/PlaceOrderReservation";




const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const { user } = useAuth()
  const [role, setRole] = useState("");
  const [roleFixed, setRoleFixed] = useState(false);
  const [authMode, setAuthMode] = useState("S'inscrire");



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
              <ProtectedRoute role="client">
                <ClientLayout transparent={true}>
                  <Livraison />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute role="client">
                <ClientLayout >
                  <Cart />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/placeorder"
            element={
              <ProtectedRoute role="client">
                <PlaceOrder />

              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <ProtectedRoute role="client">
                <ClientLayout hideCart={true} transparent={true}>
                  <Reservation />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/client" element={
            <ClientLayout transparent={true}>
              <EspaceClient user={user} />  {/* 🔥 ajoute user */}
            </ClientLayout>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <ClientLayout transparent={true} hideCart={true}  >
                <Admin />
              </ClientLayout>
            </ProtectedRoute>
          } />
          <Route path="/livreur" element={
            <ProtectedRoute role="livreur">
              <ClientLayout transparent={true} hideCart={true}  >
                <Livreur />

              </ClientLayout>
            </ProtectedRoute>

          } />
          <Route path="/respre" element={
            <ProtectedRoute role="client">
              <ClientLayout transparent={true} hideCart={true}>
                <ResePrecommande />

              </ClientLayout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/placeorder-reservation" element={
            <ProtectedRoute role="client">
              <PlaceOrderReservation />
              </ProtectedRoute>} />

          <Route path="/menu-precommande" element={
            <ProtectedRoute role="client">
              <ClientLayout transparent={true}>
                <MenuPrecommande />
              </ClientLayout>
            </ProtectedRoute>
          } />





        </Routes>

      </div>
    </>
  );
};

export default App;