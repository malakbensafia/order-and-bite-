import './LoginPopup.css'
import { assets } from '../../assets/assets'
import supabase from '../../supabaseClient'
import React, { useState, useEffect } from 'react'

const LoginPopup = ({ setShowLogin, role, setRole, roleFixed, authMode }) => {

  const [currState, setCurrState] = useState("S'inscrire")

  useEffect(() => {
    setCurrState(authMode)
  }, [authMode])

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: ""
  })

  const isAdmin = role === "admin"

  // ---------------- VALIDATION ----------------

  const isValidName = (value) => /^[A-Za-zÀ-ÿ\s]{2,}$/.test(value)

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const isStrongPassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)

  // ---------------- 🔥 PASSWORD STRENGTH ----------------

  const getPasswordStrength = (password) => {
    let score = 0

    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return "faible"
    if (score === 3 || score === 4) return "moyen"
    return "fort"
  }

  const strength = getPasswordStrength(form.password)

  const passwordMessage =
    !form.password
      ? ""
      : strength === "faible"
        ? "Ajoute : 8 caractères, 1 majuscule, 1 chiffre, 1 symbole"
        : strength === "moyen"
          ? "Presque bon : ajoute un symbole"
          : "Mot de passe sécurisé ✔"

  // ---------------- CHANGE ----------------

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ---------------- SIGNUP ----------------

  const handleSubmit = async (e) => {
    e.preventDefault()

    const rawPhone = form.telephone.replace(/\D/g, "")

    if (!/^[5-7][0-9]{8}$/.test(rawPhone)) {
      return alert("Téléphone invalide")
    }

    const cleanPhone = "0" + rawPhone

    if (!isValidName(form.nom)) return alert("Nom invalide")
    if (!isValidName(form.prenom)) return alert("Prénom invalide")
    if (!isValidEmail(form.email)) return alert("Email invalide")
    if (!isStrongPassword(form.password)) return alert("Mot de passe trop faible")

    const { data: user, error } = await supabase
      .from('utilisateur')
      .insert([{
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: cleanPhone,
        motdepasse: form.password,
        role: role
      }])
      .select()
      .single()

    if (error) {
      console.log(error)
      alert("Erreur inscription")
      return
    }

    const id = user.idutilisateur

    if (role === "client") {
      await supabase.from('client').insert({
        idutilisateur: id,
        pointfidelite: 0
      })
    }

    if (role === "livreur") {
      await supabase.from('livreur').insert({
        idutilisateur: id,
        zonelivraison: "",
        statutlivreur: "disponible",
        latitudeliv: null,
        longitudeliv: null
      })
    }

    alert("Compte créé ✔")
    setCurrState("Se connecter")
  }

  // ---------------- LOGIN ----------------

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('email', form.email)
      .eq('motdepasse', form.password)
      .single()

    if (error || !data) {
      alert("Login incorrect ❌")
      return
    }

    localStorage.setItem("user", JSON.stringify(data))
    alert("Connexion réussie ✅")
    setShowLogin(false)
  }

  return (
    <div className='login-popup'>
      <form
        onSubmit={currState === "S'inscrire" ? handleSubmit : handleLogin}
        className="login-popup-container"
      >

        <div className="login-popup-title">
          <h2>{isAdmin ? "Connexion Admin" : currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.close} alt="" />
        </div>

        <div className="login-popup-inputs">

          {isAdmin ? (
            <>
              <input name="email" onChange={handleChange} placeholder="Email admin" required />
              <input name="password" onChange={handleChange} type="password" placeholder="Mot de passe" required />
            </>
          ) : (
            <>
              {currState === "S'inscrire" && (
                <>
                  <input name="nom" onChange={handleChange} placeholder="Nom" required />
                  <input name="prenom" onChange={handleChange} placeholder="Prénom" required />
                  <input name="email" onChange={handleChange} placeholder="Email" required />

                  <div className="phone-wrapper">
                    <div className="phone-code">🇩🇿 +213</div>

                    <input
                      name="telephone"
                      value={form.telephone}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "") // chiffres uniquement

                        // limiter à 9 chiffres (Algérie mobile)
                        if (v.length > 9) v = v.slice(0, 9)

                        // format : 54 33 21 22 3
                        v = v.replace(/(\d{2})(?=\d)/g, "$1 ").trim()

                        setForm({ ...form, telephone: v })
                      }}
                      placeholder="54 33 21 22 3"
                      required
                    />
                  </div>

                  <input
                    name="password"
                    onChange={handleChange}
                    type="password"
                    placeholder="Mot de passe"
                    required
                  />

                  {/* 🔥 PASSWORD UI (REMISE COMME AVANT) */}
                  <div className="password-info">
                    <p className={`password-message ${strength}`}>
                      {passwordMessage}
                    </p>

                    <div className={`strength ${strength}`}>
                      Force : {strength}
                    </div>

                    <div className="bar">
                      <div className={`fill ${strength}`}></div>
                    </div>
                  </div>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={roleFixed && currState === "S'inscrire"}
                  >
                    <option value="client">Client</option>
                    <option value="livreur">Livreur</option>
                  </select>
                </>
              )}

              {currState === "Se connecter" && (
                <>
                  <input name="email" onChange={handleChange} placeholder="Email" required />
                  <input name="password" onChange={handleChange} type="password" placeholder="Mot de passe" required />
                </>
              )}
            </>
          )}

        </div>

        <button type="submit">
          {currState === "S'inscrire" ? "Créer compte" : "Se connecter"}
        </button>

        {!isAdmin && (
          <p>
            {currState === "S'inscrire"
              ? "Déjà un compte ? "
              : "Créer un compte "}
            <span onClick={() =>
              setCurrState(currState === "S'inscrire" ? "Se connecter" : "S'inscrire")
            }>
              {currState === "S'inscrire" ? "Se connecter" : "S'inscrire"}
            </span>
          </p>
        )}

      </form>
    </div>
  )
}

export default LoginPopup