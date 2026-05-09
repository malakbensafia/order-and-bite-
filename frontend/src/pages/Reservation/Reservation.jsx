import { useState, useEffect } from "react";
import "./Reservation.css";
import { supabase } from "../../api/supabaseClient";
import { zones } from "../../assets/assets";
import { CheckCircle } from "lucide-react";
import { passerReservationSimple } from "../../api/reservationApi";

const Reservation = () => {
  const [zone, setZone] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [heuresDisponibles, setHeuresDisponibles] = useState([]);
  const [formData, setFormData] = useState({ date: "", heure: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservedDates, setReservedDates] = useState([]);
  const [loadingHeures, setLoadingHeures] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toutesHeures = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  const toDateStr = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    if (zone) {
      setLoading(true);
      supabase
        .from("tablerest")
        .select("*")
        .eq("emplacement", zone)
        .then(({ data, error }) => {
          setTables(!error && data ? data : []);
          setLoading(false);
        });
    }
  }, [zone]);

  const chargerDatesReservees = async (tableId) => {
    const { data } = await supabase
      .from("reservation")
      .select("datereservation, heureres")
      .eq("idtable", tableId);

    if (!data) { setReservedDates([]); return; }

    const reservesParDate = {};
    data.forEach(({ datereservation, heureres }) => {
      if (!reservesParDate[datereservation]) reservesParDate[datereservation] = [];
      reservesParDate[datereservation].push(heureres.slice(0, 5));
    });

    const datesCompletes = Object.entries(reservesParDate)
      .filter(([_, heures]) => heures.length >= toutesHeures.length)
      .map(([date]) => date);

    setReservedDates(datesCompletes);
  };

  const verifierDisponibilite = async (tableId, date, heure) => {
    const { data } = await supabase
      .from("reservation")
      .select("*")
      .eq("idtable", tableId)
      .eq("datereservation", date)
      .eq("heureres", heure);
    return data.length === 0;
  };

  const chargerHeuresDisponibles = async (tableId, date) => {
    setLoadingHeures(true);
    const dispo = await Promise.all(
      toutesHeures.map(async (heure) => ({
        heure,
        disponible: await verifierDisponibilite(tableId, date, heure),
      }))
    );
    setHeuresDisponibles(dispo);
    setLoadingHeures(false);
  };

  const ouvrirReservation = async (table) => {
    setSelectedTable(table);
    setFormData({ date: "", heure: "" });
    setHeuresDisponibles([]);
    setCurrentMonth(new Date());
    await chargerDatesReservees(table.idtable);
    setStep("date");
  };

  const selectionnerDate = (dateStr) => {
    setFormData({ date: dateStr, heure: "" });
    chargerHeuresDisponibles(selectedTable.idtable, dateStr);
    setTimeout(() => setStep("heure"), 200);
  };

  const selectionnerHeure = (heure) => {
    setFormData((prev) => ({ ...prev, heure }));
    setTimeout(() => confirmerReservation(heure), 200);
  };

  // ── MODIFIÉ — utilise passerReservationSimple depuis l'API ──
  const confirmerReservation = async (heure) => {
    const disponible = await verifierDisponibilite(selectedTable.idtable, formData.date, heure);
    if (!disponible) {
      alert("Ce créneau vient d'être pris. Veuillez choisir une autre heure.");
      setStep("heure");
      chargerHeuresDisponibles(selectedTable.idtable, formData.date);
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const userId = savedUser?.idutilisateur ?? null;

    const result = await passerReservationSimple({
      idclient: userId,
      idadmin: 7,
      idtable: selectedTable.idtable,
      formData: { date: formData.date, heure },
      nbrpersonnes: selectedTable.capacitetable,
    });

    if (result.error) { alert("Erreur : " + result.error); return; }

    // Vérifier si toutes les heures de la date sont prises
    const { data: resaDate } = await supabase
      .from("reservation")
      .select("heureres")
      .eq("idtable", selectedTable.idtable)
      .eq("datereservation", formData.date);

    const heuresPrises = (resaDate || []).map(r => r.heureres.slice(0, 5));
    const toutesHeuresPrises = toutesHeures.every(h => heuresPrises.includes(h));
    if (toutesHeuresPrises) setReservedDates(prev => [...prev, formData.date]);

    const { data } = await supabase.from("tablerest").select("*").eq("emplacement", zone);
    if (data) setTables(data);

    setFormData((prev) => ({ ...prev, heure }));
    setStep("confirm");
  };

  const fermerFormulaire = () => {
    setStep(null);
    setSelectedTable(null);
    setFormData({ date: "", heure: "" });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startPad = firstDay.getDay();
    startPad = startPad === 0 ? 6 : startPad - 1;
    const days = [];
    for (let i = startPad; i > 0; i--) {
      const d = new Date(year, month, -i + 1);
      days.push({ date: d, isCurrentMonth: false, dateStr: toDateStr(d) });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, dateStr: toDateStr(d) });
    }
    return days;
  };

  const isPrevMonthDisabled = () => {
    const now = new Date();
    return (
      currentMonth.getFullYear() === now.getFullYear() &&
      currentMonth.getMonth() === now.getMonth()
    );
  };

  const formatDate = (ds) => {
    if (!ds) return "";
    const [y, m, d] = ds.split("-");
    const months = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="reservation-page">
      <div className="reservation-hero">
        <div className="hero-overlay">
          <h1>Réservez votre table selon vos préférences</h1>
          <p>Choisissez une zone pour voir les tables disponibles</p>
        </div>
      </div>

      <div className="reservation-body">

        {!zone && (
          <div className="zones-grid">
            {zones.map((z) => (
              <div
                key={z.key}
                className="zone-card"
                style={{ backgroundImage: `url(${z.image})` }}
                onClick={() => setZone(z.key)}
              >
                <div className="zone-overlay"><h2>{z.label}</h2></div>
              </div>
            ))}
          </div>
        )}

        {zone && (
          <div className="tables-section">
            <button className="back-btn" onClick={() => { setZone(null); fermerFormulaire(); }}>
              ← Retour aux zones
            </button>

            <h2>Tables disponibles — {zone}</h2>

            <div className="tables-and-form">

              <div className="tables-grid">
                {loading ? (
                  <p>Chargement des tables...</p>
                ) : tables.length === 0 ? (
                  <p>Aucune table disponible dans cette zone</p>
                ) : (
                  tables.map((table) => (
                    <div
                      key={table.idtable}
                      className={`table-card ${selectedTable?.idtable === table.idtable ? "table-card--active" : ""}`}
                    >
                      <h3>Table {table.numtable}</h3>
                      <p>Capacité : {table.capacitetable} personnes</p>
                      <button className="reserve-btn" onClick={() => ouvrirReservation(table)}>
                        Réserver
                      </button>
                    </div>
                  ))
                )}
              </div>

              {step && selectedTable && (
                <div className="form-resa-box">

                  <div className="tf-steps">
                    <div className={`tf-step ${step === "date" ? "active" : ""}`}>Date</div>
                    <span className="tf-sep">›</span>
                    <div className={`tf-step ${step === "heure" ? "active" : ""}`}>Heure</div>
                    <span className="tf-sep">›</span>
                    <div className={`tf-step ${step === "confirm" ? "active" : ""}`}>Confirmé</div>
                  </div>

                  <h3>Table {selectedTable.numtable}</h3>

                  {step === "date" && (
                    <>
                      <button className="back-btn small" onClick={fermerFormulaire}>← Annuler</button>

                      <div className="thefork-calendar">
                        <div className="calendar-header">
                          <button
                            className="month-nav"
                            onClick={() => {
                              if (!isPrevMonthDisabled())
                                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
                            }}
                            disabled={isPrevMonthDisabled()}
                          >◀</button>
                          <span>{currentMonth.toLocaleString("fr", { month: "long", year: "numeric" })}</span>
                          <button
                            className="month-nav"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                          >▶</button>
                        </div>

                        <div className="calendar-weekdays">
                          {["lun", "mar", "mer", "jeu", "ven", "sam", "dim"].map((d) => (
                            <div key={d}>{d}</div>
                          ))}
                        </div>

                        <div className="calendar-days">
                          {getDaysInMonth().map((day, idx) => {
                            const isPast = day.date < today;
                            const isReserved = reservedDates.includes(day.dateStr);
                            const isSelected = formData.date === day.dateStr;
                            const isClickable = day.isCurrentMonth && !isPast && !isReserved;

                            let cls = "calendar-day";
                            if (!day.isCurrentMonth) cls += " other";
                            else if (isPast) cls += " past";
                            else if (isReserved) cls += " unavailable";
                            else cls += " available";
                            if (isSelected) cls += " selected";

                            return (
                              <div key={idx} className={cls} onClick={() => isClickable && selectionnerDate(day.dateStr)}>
                                {day.date.getDate()}
                              </div>
                            );
                          })}
                        </div>

                        <div className="calendar-legend">
                          <span><span className="legend-available"></span> Disponible</span>
                          <span><span className="legend-unavailable"></span> Complet</span>
                        </div>
                      </div>

                      <p className="cal-note">
                        Les offres peuvent varier en fonction de l'heure, de la date et du nombre de personnes.
                      </p>
                    </>
                  )}

                  {step === "heure" && (
                    <>
                      <button className="back-btn small" onClick={() => setStep("date")}>← Changer la date</button>
                      <div className="tf-recap">{formatDate(formData.date)}</div>
                      <p className="heures-title">Sélectionnez une heure</p>
                      <div className="heures-grid">
                        {loadingHeures ? (
                          <p className="info-text">Chargement...</p>
                        ) : heuresDisponibles.length === 0 ? (
                          <p className="info-text">Aucune heure disponible</p>
                        ) : (
                          heuresDisponibles.map(({ heure, disponible }) => (
                            <button
                              key={heure}
                              className={`heure-item ${formData.heure === heure ? "selected" : ""} ${!disponible ? "taken" : ""}`}
                              disabled={!disponible}
                              onClick={() => disponible && selectionnerHeure(heure)}
                            >
                              {heure}
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}

                  {step === "confirm" && (
                    <div className="tf-success">
                      <div className="tf-success-icon">
                        <CheckCircle size={48} color="#2d6a4f" strokeWidth={1.5} />
                      </div>
                      <h3>Réservation confirmée !</h3>
                      <p>
                        Table <strong>{selectedTable.numtable}</strong><br />
                        Le <strong>{formatDate(formData.date)}</strong> à <strong>{formData.heure}</strong>
                      </p>
                      <button className="reserve-btn" onClick={fermerFormulaire}>Fermer</button>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reservation;