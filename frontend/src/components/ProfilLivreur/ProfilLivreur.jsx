import React, { useState, useEffect } from "react";
import "./ProfilLivreur.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../api/supabaseClient";
import {
    FaUser, FaPhone, FaMotorcycle, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaEnvelope
} from "react-icons/fa";

const ProfilLivreur = () => {
    const { user } = useAuth();
    const [livreurData, setLivreurData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (user?.idutilisateur) fetchLivreur();
    }, [user]);

    const fetchLivreur = async () => {
        const { data } = await supabase
            .from("livreur")
            .select("zonelivraison, statutlivreur")
            .eq("idutilisateur", user.idutilisateur)
            .single();

        if (data) {
            const merged = {
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                telephone: user.telephone,
                zonelivraison: data.zonelivraison,
                statutlivreur: data.statutlivreur,
            };
            setLivreurData(merged);
            setForm(merged);
        }
    };

    const handleSave = async () => {
        await supabase.from("utilisateur").update({
            nom: form.nom,
            prenom: form.prenom,
            telephone: form.telephone,
        }).eq("idutilisateur", user.idutilisateur);

        await supabase.from("livreur").update({
            zonelivraison: form.zonelivraison,
            statutlivreur: form.statutlivreur,
        }).eq("idutilisateur", user.idutilisateur);

        setLivreurData({ ...form });
        setEditMode(false);
    };

    const handleCancel = () => {
        setForm({ ...livreurData });
        setEditMode(false);
    };

    if (!livreurData) return <div className="pl-loading">Chargement...</div>;

    const isDispo = livreurData.statutlivreur === "disponible";

    return (
        <div className="profil-livreur-wrapper">

            {/* HERO */}
            <div className="pl-hero">
                <div className="pl-hero-overlay">
                    <div className="pl-avatar"><FaUser /></div>
                    <div className="pl-hero-info">
                        <h1>{livreurData.nom} {livreurData.prenom}</h1>
                        <span className={`pl-badge ${isDispo ? "dispo" : "indispo"}`}>
                            ● {livreurData.statutlivreur}
                        </span>
                    </div>
                    <button className="pl-edit-btn" onClick={() => setEditMode(true)}>
                        <FaEdit /> Modifier
                    </button>
                </div>
            </div>

            {/* INFO CARDS */}
            <div className="pl-info-grid">

                <div className="pl-info-card">
                    <div className="pl-info-icon"><FaUser /></div>
                    <div className="pl-info-content">
                        <label>Nom</label>
                        {editMode
                            ? <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                            : <p>{livreurData.nom}</p>
                        }
                    </div>
                </div>

                <div className="pl-info-card">
                    <div className="pl-info-icon"><FaUser /></div>
                    <div className="pl-info-content">
                        <label>Prénom</label>
                        {editMode
                            ? <input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
                            : <p>{livreurData.prenom}</p>
                        }
                    </div>
                </div>

                <div className="pl-info-card">
                    <div className="pl-info-icon"><FaEnvelope /></div>
                    <div className="pl-info-content">
                        <label>Email</label>
                        <p>{livreurData.email}</p>
                    </div>
                </div>

                <div className="pl-info-card">
                    <div className="pl-info-icon"><FaPhone /></div>
                    <div className="pl-info-content">
                        <label>Téléphone</label>
                        {editMode
                            ? <input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
                            : <p>{livreurData.telephone}</p>
                        }
                    </div>
                </div>

                <div className="pl-info-card">
                    <div className="pl-info-icon"><FaMapMarkerAlt /></div>
                    <div className="pl-info-content">
                        <label>Zone de livraison</label>
                        {editMode
                            ? <input value={form.zonelivraison} onChange={e => setForm({ ...form, zonelivraison: e.target.value })} />
                            : <p>{livreurData.zonelivraison || "—"}</p>
                        }
                    </div>
                </div>

                <div className="pl-info-card">
                    <div className="pl-info-icon"><FaMotorcycle /></div>
                    <div className="pl-info-content">
                        <label>Statut</label>
                        {editMode
                            ? (
                                <select value={form.statutlivreur} onChange={e => setForm({ ...form, statutlivreur: e.target.value })}>
                                    <option value="disponible">Disponible</option>
                                    <option value="indisponible">Indisponible</option>
                                </select>
                            )
                            : <p>{livreurData.statutlivreur}</p>
                        }
                    </div>
                </div>

            </div>

            {/* ACTIONS */}
            {editMode && (
                <div className="pl-actions">
                    <button className="pl-save-btn" onClick={handleSave}><FaSave /> Sauvegarder</button>
                    <button className="pl-cancel-btn" onClick={handleCancel}><FaTimes /> Annuler</button>
                </div>
            )}

        </div>
    );
};

export default ProfilLivreur;