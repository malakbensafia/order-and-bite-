import React, { useState, useEffect } from 'react'
import './AvisSection.css'
import StarRating from '../StarRating/StarRating'
import { useAuth } from "../../context/AuthContext";
import { addAvis, updateMoyennePlat, getMoyennePlat } from "../../api/avisApi";
import supabase from "../../api/supabaseClient";

const AvisSection = ({ idplat }) => {

  const [moyenne, setMoyenne] = useState(0)
  const [avisList, setAvisList] = useState([])
  const [commentaire, setCommentaire] = useState("")
  const [noteSelectionnee, setNoteSelectionnee] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  // CHARGER AVIS + MOYENNE
  useEffect(() => {
    const fetchData = async () => {
      const moy = await getMoyennePlat(idplat)
      setMoyenne(moy)

      const { data } = await supabase
        .from("avis")
        .select("*")
        .eq("idplat", idplat)
        .order("dateavis", { ascending: false })

      setAvisList(data || [])
    }
    fetchData()
  }, [idplat])

  // SOUMETTRE AVIS
  const handleSubmit = async () => {
    if (!user) { alert("Veuillez vous connecter"); return; }
    if (noteSelectionnee === 0) { alert("Veuillez choisir une note"); return; }
    if (!commentaire.trim()) { alert("Veuillez écrire un commentaire"); return; }

    const avis = await addAvis({
      note: noteSelectionnee,
      commentaire: commentaire.trim(),
      dateavis: new Date(),
      idclient: user.idutilisateur,
      idplat: idplat
    })

    if (!avis) { alert("Erreur ajout avis"); return; }

    await updateMoyennePlat(idplat)
    const moy = await getMoyennePlat(idplat)
    setMoyenne(moy)

    const { data } = await supabase
      .from("avis")
      .select("*")
      .eq("idplat", idplat)
      .order("dateavis", { ascending: false })

    setAvisList(data || [])
    setCommentaire("")
    setNoteSelectionnee(0)
    setShowForm(false)
    alert("Avis ajouté ✅")
  }

  return (
    <div className="avis-section">

      {/* MOYENNE */}
      <div className="avis-moyenne">
        ⭐ {moyenne}/5 ({avisList.length} avis)
      </div>

      {/* BOUTON LAISSER UN AVIS */}
      <button
        className="avis-toggle-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Annuler" : "✍️ Laisser un avis"}
      </button>

      {/* FORMULAIRE AVIS */}
      {showForm && (
        <div className="avis-form">
          <StarRating onRate={(val) => setNoteSelectionnee(val)} />
          <p className="avis-note-selected">
            {noteSelectionnee > 0 ? `Note : ${noteSelectionnee}/5` : "Choisissez une note"}
          </p>
          <textarea
            className="avis-textarea"
            placeholder="Votre commentaire..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows={3}
          />
          <button className="avis-submit-btn" onClick={handleSubmit}>
            Envoyer
          </button>
        </div>
      )}

      {/* LISTE AVIS */}
      <div className="avis-list">
        {avisList.length === 0 && (
          <p className="avis-empty">Aucun avis pour ce plat</p>
        )}
        {avisList.map((avis) => (
          <div key={avis.idavis} className="avis-item">
            <div className="avis-header">
              <span className="avis-note">⭐ {avis.note}/5</span>
              <span className="avis-date">
                {new Date(avis.dateavis).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <p className="avis-commentaire">{avis.commentaire}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default AvisSection