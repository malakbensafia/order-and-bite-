import React, { useState, useEffect } from "react";
import { supabase } from "../../api/supabaseClient";

const CodesPromoPage = () => {
    const [codesPromo, setCodesPromo] = useState([]);
    const [nouveauCode, setNouveauCode] = useState("");
    const [valeurReduction, setValeurReduction] = useState(10);
    const [typeReduction, setTypeReduction] = useState("pourcentage");
    const [debutCode, setDebutCode] = useState("");
    const [finCode, setFinCode] = useState("");

    // ✅ modal clients
    const [showModal, setShowModal] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchCodesPromo();
    }, []);

    const fetchCodesPromo = async () => {
        const { data } = await supabase
            .from("codepromo")
            .select("*")
            .order("idcodepromo", { ascending: false });
        setCodesPromo(data || []);
    };

    const fetchClients = async () => {
        const { data } = await supabase
            .from("client")
            .select("idutilisateur, utilisateur(nom, prenom, email)");
        setClients(data || []);
    };

    const ouvrirModal = async (code) => {
        setSelectedCode(code);
        setSelectedClients([]);
        await fetchClients();
        setShowModal(true);
    };

    const toggleClient = (id) => {
        setSelectedClients(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toutSelectionner = () => {
        if (selectedClients.length === clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clients.map(c => c.idutilisateur));
        }
    };

    const envoyerCode = async () => {
        if (selectedClients.length === 0) { alert("Sélectionnez au moins un client !"); return; }
        setSending(true);

        await supabase.from("notification").insert(
            selectedClients.map(idutilisateur => ({
                message: `🎁 Code promo exclusif : ${selectedCode.code} — ${selectedCode.valeurreduction}${selectedCode.typereduction === "pourcentage" ? "%" : " DA"} de réduction ! Valable jusqu'au ${selectedCode.datefin}. Saisissez-le dans votre panier.`,
                isread: false,
                datecreationnotif: new Date().toISOString(),
                idutilisateur
            }))
        );

        setSending(false);
        setShowModal(false);
        alert(`Code envoyé à ${selectedClients.length} client(s) !`);
    };

    const creerCodePromo = async () => {
        if (!nouveauCode.trim()) { alert("Veuillez saisir un code !"); return; }
        if (!debutCode || !finCode) { alert("Veuillez remplir les deux dates !"); return; }
        if (new Date(debutCode) >= new Date(finCode)) { alert("La date de début doit être inférieure à la date de fin !"); return; }
        if (valeurReduction <= 0) { alert("La valeur de réduction doit être supérieure à 0 !"); return; }

        const { data, error } = await supabase
            .from("codepromo")
            .insert([{
                code: nouveauCode.trim().toUpperCase(),
                valeurreduction: valeurReduction,
                typereduction: typeReduction,
                datedebut: debutCode,
                datefin: finCode
            }])
            .select()
            .single();

        if (error) { alert("Erreur : " + error.message); return; }

        setCodesPromo(prev => [data, ...prev]);
        setNouveauCode("");
        setValeurReduction(10);
        setTypeReduction("pourcentage");
        setDebutCode("");
        setFinCode("");
        alert("Code promo créé !");
    };

    const supprimerCodePromo = async (idcodepromo) => {
        await supabase.from("codepromo").delete().eq("idcodepromo", idcodepromo);
        setCodesPromo(prev => prev.filter(c => c.idcodepromo !== idcodepromo));
    };

    const isCodeActif = (code) => {
        const now = new Date();
        return now >= new Date(code.datedebut) && now <= new Date(code.datefin);
    };

    return (
        <div className="promotions-container">
            <h2>Gestion des codes promo</h2>

            <div className="promo-form">
                <div className="promo-form-row">
                    <label>Code</label>
                    <input
                        type="text"
                        placeholder="Ex: ETE2025"
                        value={nouveauCode}
                        onChange={(e) => setNouveauCode(e.target.value.toUpperCase())}
                    />
                </div>
                <div className="promo-form-row">
                    <label>Type de réduction</label>
                    <select value={typeReduction} onChange={(e) => setTypeReduction(e.target.value)}>
                        <option value="pourcentage">Pourcentage (%)</option>
                        <option value="montant">Montant fixe (DA)</option>
                    </select>
                </div>
                <div className="promo-form-row">
                    <label>Valeur {typeReduction === "pourcentage" ? "(%)" : "(DA)"}</label>
                    <input
                        type="number"
                        min="1"
                        max={typeReduction === "pourcentage" ? 100 : undefined}
                        value={valeurReduction}
                        onChange={(e) => setValeurReduction(Number(e.target.value))}
                    />
                </div>
                <div className="promo-form-row">
                    <label>Date début</label>
                    <input type="date" value={debutCode} onChange={(e) => setDebutCode(e.target.value)} />
                </div>
                <div className="promo-form-row">
                    <label>Date fin</label>
                    <input type="date" value={finCode} onChange={(e) => setFinCode(e.target.value)} />
                </div>
                <button className="promo-btn" onClick={creerCodePromo}>
                    Créer le code
                </button>
            </div>

            <hr />

            <h3>Codes existants</h3>
            <div className="promo-list">
                {codesPromo.length === 0 && <p>Aucun code promo</p>}
                {codesPromo.map((c) => (
                    <div key={c.idcodepromo} className="promo-item">
                        <span className="promo-plat-name" style={{ fontWeight: "bold", letterSpacing: 1 }}>
                            {c.code}
                        </span>
                        <span className="promo-taux">
                            -{c.valeurreduction}{c.typereduction === "pourcentage" ? "%" : " DA"}
                        </span>
                        <span className="promo-dates">
                            {c.datedebut} → {c.datefin}
                        </span>
                        <span style={{ color: isCodeActif(c) ? "green" : "gray", fontWeight: "bold" }}>
                            {isCodeActif(c) ? " Actif" : " Expiré"}
                        </span>
                        {/* ✅ bouton envoyer */}
                        {isCodeActif(c) && (
                            <button
                                className="promo-btn"
                                style={{ padding: "4px 12px", fontSize: 12 }}
                                onClick={() => ouvrirModal(c)}
                            >
                                📤 Envoyer
                            </button>
                        )}
                        <button className="promo-delete-btn" onClick={() => supprimerCodePromo(c.idcodepromo)}>
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>

            {/* ✅ MODAL CLIENTS */}
            {showModal && selectedCode && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}
                        style={{ maxWidth: 500, maxHeight: "80vh", overflowY: "auto" }}>
                        <h3>Envoyer le code <strong>{selectedCode.code}</strong></h3>
                        <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
                            Sélectionnez les clients qui recevront ce code
                        </p>

                        <button
                            className="promo-btn"
                            style={{ marginBottom: 12, fontSize: 13 }}
                            onClick={toutSelectionner}
                        >
                            {selectedClients.length === clients.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </button>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {clients.map(c => (
                                <div
                                    key={c.idutilisateur}
                                    onClick={() => toggleClient(c.idutilisateur)}
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: 8,
                                        border: `2px solid ${selectedClients.includes(c.idutilisateur) ? "#3E2C23" : "#eee"}`,
                                        background: selectedClients.includes(c.idutilisateur) ? "#f5ede8" : "white",
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <span>{c.utilisateur?.prenom} {c.utilisateur?.nom}</span>
                                    <small style={{ color: "#888" }}>{c.utilisateur?.email}</small>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                            <button
                                className="promo-btn"
                                onClick={envoyerCode}
                                disabled={sending}
                                style={{ flex: 1 }}
                            >
                                {sending ? "Envoi..." : `📤 Envoyer à ${selectedClients.length} client(s)`}
                            </button>
                            <button
                                className="promo-delete-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodesPromoPage;