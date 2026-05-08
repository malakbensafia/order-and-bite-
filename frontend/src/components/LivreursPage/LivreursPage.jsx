import React, { useEffect, useState } from "react";
import "./LivreursPage.css";
import { supabase } from "../../api/supabaseClient";
import { FaTruck, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const LivreursPage = () => {

    const [livreurs, setLivreurs] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchLivreurs();
    }, []);

    const fetchLivreurs = async () => {
        const { data } = await supabase
            .from("livreur")
            .select(`
                zonelivraison,
                statutlivreur,
                utilisateur (
                    nom,
                    prenom,
                    email,
                    telephone
                )
            `);

        if (data) setLivreurs(data);
    };

    return (
        <div className="livreurs-page">

            <h2>Livreurs</h2>

            <div className="livreurs-grid">

                {livreurs.map((l, i) => (
                    <div
                        key={i}
                        className="livreur-card"
                        onClick={() => setSelected(l)}
                    >
                        <div className="icon"><FaTruck /></div>

                        <h3>{l.utilisateur?.nom} {l.utilisateur?.prenom}</h3>

                        <p><FaEnvelope /> {l.utilisateur?.email}</p>
                        <p><FaPhone /> {l.utilisateur?.telephone}</p>
                        <p><FaMapMarkerAlt /> {l.zonelivraison}</p>

                        <span className={`badge ${l.statutlivreur}`}>
                            {l.statutlivreur}
                        </span>
                    </div>
                ))}

            </div>

            {/* MODAL */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>
                            {selected.utilisateur.nom} {selected.utilisateur.prenom}
                        </h2>

                        <p>{selected.utilisateur.email}</p>
                        <p>{selected.utilisateur.telephone}</p>
                        <p>{selected.zonelivraison}</p>

                        <button onClick={() => setSelected(null)}>
                            Fermer
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default LivreursPage;