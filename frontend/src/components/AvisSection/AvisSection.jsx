import React, { useState, useEffect } from 'react'
import './AvisSection.css'
import StarRating from '../StarRating/StarRating'
import { FaUser, FaUtensils, FaStar, FaCalendar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { addAvis, updateMoyennePlat } from "../../api/avisApi";
import supabase from "../../api/supabaseClient";
import { ajouterPoints } from "../../api/fideliteApi";

const AvisSection = ({ idplat }) => {

  const [tousLesAvis, setTousLesAvis] = useState([])
  const [commentaire, setCommentaire] = useState("")
  const [noteSelectionnee, setNoteSelectionnee] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  // CHARGER TOUS LES AVIS
  const fetchTousLesAvis = async () => {
    const { data } = await supabase
      .from("avis")
      .select(`*, client(utilisateur(prenom)), plat(nomplat)`)
      .order("dateavis", { ascending: false })

    setTousLesAvis(data || [])
  }

  useEffect(() => {
    fetchTousLesAvis()
  }, [])

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
    await fetchTousLesAvis()
    if (user?.idutilisateur) {
    await ajouterPoints(user.idutilisateur, 20, "avis_laisse");
}

    setCommentaire("")
    setNoteSelectionnee(0)
    setShowForm(false)
    alert("Avis ajouté ")
  }

  return (
    <div className="avis-section">

      {/* BOUTON LAISSER UN AVIS */}
      {idplat && (
        <>
          <button
            className="avis-toggle-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Annuler" : " Laisser un avis"}
          </button>

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
        </>
      )}

      {/* TOUS LES AVIS */}
      <div className="avis-list">
        {tousLesAvis.length === 0 && (
          <p className="avis-empty">Aucun commentaire pour le moment</p>
        )}
        {tousLesAvis.map((avis) => (
          <div key={avis.idavis} className="avis-item">
            <div className="avis-header">
              <span className="avis-nom">
                <FaUser /> {avis.client?.utilisateur?.prenom || "Anonyme"}
              </span>
              <span className="avis-plat-nom">
                <FaUtensils /> {avis.plat?.nomplat}
              </span>
              <span className="avis-note">
                <StarRating value={avis.note} />
              </span>
              <span className="avis-date">
                <FaCalendar /> {new Date(avis.dateavis).toLocaleDateString("fr-FR")}
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