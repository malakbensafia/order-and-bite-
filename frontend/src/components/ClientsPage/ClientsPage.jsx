import React, { useEffect, useState } from "react";
import "./ClientsPage.css";
import { supabase } from "../../api/supabaseClient";
import { FaUser, FaPhone, FaEnvelope, FaStar } from "react-icons/fa";

const ClientsPage = () => {

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const { data } = await supabase
            .from("client")
            .select(`
                pointfidelite,
                utilisateur (
                    idutilisateur,
                    nom,
                    prenom,
                    email,
                    telephone
                )
            `);

        if (data) setClients(data);
    };

    const filtered = clients.filter(c =>
        `${c.utilisateur?.nom} ${c.utilisateur?.prenom}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    const bloquerClient = async (id) => {
    const confirm = window.confirm("Bloquer ce client ?");
    if (!confirm) return;

    const { error } = await supabase
        .from("client")
        .update({ statut: "bloque" }) // ⚠️ ajoute colonne si besoin
        .eq("idutilisateur", id);

    if (!error) {
        alert("Client bloqué");
        fetchClients();
        setSelectedClient(null);
    }
};

const supprimerClient = async (id) => {
    const confirm = window.confirm("Supprimer ce client ?");
    if (!confirm) return;

    // supprimer dans table client
    await supabase.from("client")
        .delete()
        .eq("idutilisateur", id);

    // supprimer aussi utilisateur
    await supabase.from("utilisateur")
        .delete()
        .eq("idutilisateur", id);

    fetchClients();
    setSelectedClient(null);
};

    return (
        <div className="clients-page">

            <div className="clients-header">
                <h2>Clients</h2>

                <input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="clients-grid">

                {filtered.map((c, i) => (
                    <div
                        key={i}
                        className="client-card"
                        onClick={() => setSelectedClient(c)}
                    >
                        <div className="avatar"><FaUser /></div>

                        <h3>{c.utilisateur?.nom} {c.utilisateur?.prenom}</h3>

                        <p><FaEnvelope /> {c.utilisateur?.email}</p>
                        <p><FaPhone /> {c.utilisateur?.telephone}</p>

                        <div className="fidelite">
                            <FaStar /> {c.pointfidelite} pts
                        </div>
                    </div>
                ))}

            </div>

            {/* MODAL */}
            {selectedClient && (
    <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h2>
                {selectedClient.utilisateur.nom}{" "}
                {selectedClient.utilisateur.prenom}
            </h2>

            <p>📧 {selectedClient.utilisateur.email}</p>
            <p>📞 {selectedClient.utilisateur.telephone}</p>
            <p>⭐ {selectedClient.pointfidelite} pts</p>

            <div className="admin-actions">

                <button
                    className="btn-danger"
                    onClick={() =>
                        supprimerClient(selectedClient.utilisateur.idutilisateur)
                    }
                >
                    🗑️ Supprimer
                </button>

                <button
                    className="btn-warning"
                    onClick={() =>
                        bloquerClient(selectedClient.utilisateur.idutilisateur)
                    }
                >
                    🚫 Bloquer
                </button>

                <button
                    className="btn-close"
                    onClick={() => setSelectedClient(null)}
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

export default ClientsPage;