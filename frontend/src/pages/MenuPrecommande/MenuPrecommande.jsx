import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import DisplayFood from "../DisplayFood/DisplayFood";
import { getFinalPrice } from "../../outils/promotion";
import "./MenuPrecommande.css";

const MenuPrecommande = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { plats, cartItems, getTotalCartAmount, setModePanier } = useContext(StoreContext);

    // ✅ Sauvegarde dans sessionStorage dès l'arrivée + mode panier
    useEffect(() => {
        setModePanier("precommande");
        if (location.state?.selectedTable) {
            sessionStorage.setItem("reservationState", JSON.stringify({
                selectedTable: location.state.selectedTable,
                formData: location.state.formData
            }));
            console.log("✅ reservationState sauvegardé:", location.state);
        }
    }, []);

    // ✅ Toujours lire depuis sessionStorage (résiste aux rechargements)
    const saved = JSON.parse(sessionStorage.getItem("reservationState") || "{}");
    const selectedTable = saved.selectedTable;
    const formData = saved.formData;

    const total = getTotalCartAmount();

    const confirmer = () => {
        if (total === 0) {
            alert("Ajoutez au moins un plat !");
            return;
        }

        const panier = plats
            .filter(p => cartItems[String(p.idplat)] > 0)
            .map(p => ({
                idplat: p.idplat,
                nomplat: p.nomplat,
                prix: getFinalPrice(p),
                quantite: cartItems[String(p.idplat)]
            }));

        console.log("✅ Confirmation précommande:", { panier, totalPanier: total, formData, selectedTable });

        navigate("/placeorder-reservation", {
            state: { panier, totalPanier: total, formData, selectedTable }
        });
    };

    return (
        <div className="menu-precommande-wrapper">
            <div className="menu-precommande-hero">
                <div className="hero-overlay">
                    <h1>Précommande</h1>
                    <p>
                        Table {selectedTable?.numtable}
                        {formData?.date ? ` — ${formData.date}` : ""}
                        {formData?.heure ? ` à ${formData.heure}` : ""}
                    </p>
                </div>
            </div>

            <div className="menu-precommande-body">
                <DisplayFood category="Tout" />
            </div>

            {/* ✅ Footer flottant visible dès qu'un plat est ajouté */}
            {total > 0 && (
                <div className="menu-precommande-footer">
                    <span className="menu-precommande-total">Total : {total} DA</span>
                    <button className="btn-confirmer-precommande" onClick={confirmer}>
                        Confirmer la précommande →
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuPrecommande;