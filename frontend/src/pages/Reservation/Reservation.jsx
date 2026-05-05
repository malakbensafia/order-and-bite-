import { useState, useEffect } from "react";
import "./Reservation.css";
import supabase from "../../supabaseClient";
import { zones } from "../../assets/assets";

const Reservation = () => {
  const [zone, setZone] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTableForForm, setSelectedTableForForm] = useState(null);
  const [heuresDisponibles, setHeuresDisponibles] = useState([]);
  const [formData, setFormData] = useState({ date: "", heure: "", nom: "", telephone: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservedDates, setReservedDates] = useState([]);
  const [loadingHeures, setLoadingHeures] = useState(false);
  
  useEffect(() => {
    if (zone) {
      setLoading(true);
      const fetchTables = async () => {
        const { data, error } = await supabase
          .from('tablerest')
          .select('*')
          .eq('emplacement', zone);
        
        if (!error && data) {
          setTables(data);
        } else {
          setTables([]);
        }
        setLoading(false);
      };
      fetchTables();
    }
  }, [zone]);

  const chargerDatesReservees = async (tableId) => {
    const { data } = await supabase
      .from('reservation')
      .select('datereservation')
      .eq('idtable', tableId);
    
    const dates = data.map(r => r.datereservation);
    setReservedDates(dates);
  };

  const handleReservation = async (table) => {
    const nouveauStatut = table.statutable === 'libre' ? 'occupe' : 'libre';
    
    const { error } = await supabase
      .from('tablerest')
      .update({ statutable: nouveauStatut })
      .eq('idtable', table.idtable);
    
    if (!error) {
      setTables(tables.map(t => 
        t.idtable === table.idtable 
          ? { ...t, statutable: nouveauStatut }
          : t
      ));
    }
  };

  const verifierDisponibilite = async (tableId, date, heure) => {
    const { data } = await supabase
      .from('reservation')
      .select('*')
      .eq('idtable', tableId)
      .eq('datereservation', date)
      .eq('heureres', heure);
    return data.length === 0;
  };

  const chargerHeuresDisponibles = async (tableId, date) => {
    if (!date) return;
    setLoadingHeures(true);
    const toutesHeures = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
    const dispo = await Promise.all(
      toutesHeures.map(async (heure) => ({
        heure, disponible: await verifierDisponibilite(tableId, date, heure)
      }))
    );
    setHeuresDisponibles(dispo.filter(h => h.disponible).map(h => h.heure));
    setLoadingHeures(false);
  };

  useEffect(() => {
    if (selectedTableForForm && formData.date) {
      chargerHeuresDisponibles(selectedTableForForm.idtable, formData.date);
    }
  }, [formData.date, selectedTableForForm]);

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    let startPadding = firstDay.getDay();
    startPadding = startPadding === 0 ? 6 : startPadding - 1;
    
    for (let i = startPadding; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      days.push({ date: prevDate, isCurrentMonth: false, dateStr: prevDate.toISOString().split('T')[0] });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      const dateStr = currentDate.toISOString().split('T')[0];
      days.push({ date: currentDate, isCurrentMonth: true, dateStr });
    }
    
    return days;
  };

  const changerMois = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const confirmerReservationFormulaire = async () => {
    if (!formData.nom || !formData.date || !formData.heure) {
      alert("Remplissez tous les champs");
      return;
    }
    
    const disponible = await verifierDisponibilite(selectedTableForForm.idtable, formData.date, formData.heure);
    if (!disponible) {
      alert("Cette heure n'est plus disponible");
      return;
    }

    const { error } = await supabase
      .from('reservation')
      .insert({
        datereservation: formData.date,
        heureres: formData.heure,
        nbrpersonnes: selectedTableForForm.capacitetable,
        statutres: "confirmee",
        idtable: selectedTableForForm.idtable,
        idclient: null,
        idadmin: 7
      });

    if (error) {
      alert("Erreur: " + error.message);
    } else {
      await supabase
        .from('tablerest')
        .update({ statutable: 'occupe' })
        .eq('idtable', selectedTableForForm.idtable);
      
      alert(`✅ Table ${selectedTableForForm.numtable} réservée pour ${formData.nom} le ${formData.date} à ${formData.heure}`);
      
      setShowForm(false);
      setSelectedTableForForm(null);
      setFormData({ date: "", heure: "", nom: "", telephone: "" });
      setCurrentMonth(new Date());
      
      const { data } = await supabase
        .from('tablerest')
        .select('*')
        .eq('emplacement', zone);
      if (data) setTables(data);
    }
  };

  const ouvrirFormulaire = async (table) => {
    setSelectedTableForForm(table);
    await chargerDatesReservees(table.idtable);
    setShowForm(true);
    setCurrentMonth(new Date());
    setFormData({ date: "", heure: "", nom: "", telephone: "" });
    setHeuresDisponibles([]);
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
                <div className="zone-overlay">
                  <h2>{z.label}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {zone && !showForm && (
          <div className="tables-section">
            <button className="back-btn" onClick={() => setZone(null)}>
              ← Retour aux zones
            </button>
            <h2>Tables disponibles - {zone}</h2>
            <div className="tables-grid">
              {loading ? (
                <p>Chargement des tables...</p>
              ) : tables.length === 0 ? (
                <p>Aucune table disponible dans cette zone</p>
              ) : (
                tables.map((table) => (
                  <div key={table.idtable} className="table-card">
                    <h3>Table {table.numtable}</h3>
                    <p>Capacité : {table.capacitetable} personnes</p>
                    <span className={`status ${table.statutable === 'libre' ? 'libre' : 'occupe'}`}>
                      {table.statutable === 'libre' ? 'Libre' : 'Occupé'}
                    </span>
                    {table.statutable === 'libre' ? (
                      <button 
                        className="reserve-btn"
                        onClick={() => ouvrirFormulaire(table)}
                      >
                        Réserver
                      </button>
                    ) : (
                      <button 
                        className="reserve-btn"
                        onClick={() => handleReservation(table)}
                      >
                        Libérer
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showForm && selectedTableForForm && (
          <div className="form-resa-box">
            <button className="back-btn" onClick={() => setShowForm(false)}>← Retour aux tables</button>
            <h3>Réservation Table {selectedTableForForm.numtable}</h3>
            
            <div className="thefork-calendar">
              <div className="calendar-header">
                <button className="month-nav" onClick={() => changerMois(-1)}>◀</button>
                <span>{currentMonth.toLocaleString('fr', { month: 'long', year: 'numeric' })}</span>
                <button className="month-nav" onClick={() => changerMois(1)}>▶</button>
              </div>
              <div className="calendar-weekdays">
                {['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="calendar-days">
                {getDaysInMonth().map((day, idx) => {
                  const isAvailable = !reservedDates.includes(day.dateStr);
                  const isSelected = formData.date === day.dateStr;
                  return (
                    <div
                      key={idx}
                      className={`calendar-day ${!day.isCurrentMonth ? 'other' : ''} ${isAvailable && day.isCurrentMonth ? 'available' : ''} ${!isAvailable && day.isCurrentMonth ? 'unavailable' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (isAvailable && day.isCurrentMonth) {
                          setFormData({...formData, date: day.dateStr, heure: ""});
                        }
                      }}
                    >
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

            {/* HEURES - S'AFFICHE APRÈS SÉLECTION DATE */}
            {formData.date && (
              <div className="heures-section">
                <h4>Sélectionnez une heure pour le {formData.date}</h4>
               <div className="heures-grid">
  {loadingHeures ? (
    <p className="info-text">Chargement des heures...</p>
  ) : heuresDisponibles.length === 0 ? (
    <p className="info-text">Aucune heure disponible pour cette date</p>
  ) : (
    heuresDisponibles.map(h => (
      <button
        key={h}
        className="heure-item"
        style={{
          backgroundColor: formData.heure === h ? '#a47251' : 'white',
          color: formData.heure === h ? 'white' : '#333',
          border: '1px solid #ddd',
          padding: '8px 16px',
          borderRadius: '25px',
          cursor: 'pointer'
        }}
        onClick={() => setFormData({...formData, heure: h})}
      >
        {h}
      </button>
    ))
  )}
</div>
              </div>
            )}

            <input 
              type="text" 
              placeholder="Votre nom complet" 
              value={formData.nom} 
              onChange={(e) => setFormData({...formData, nom: e.target.value})} 
            />
            <input 
              type="tel" 
              placeholder="Votre téléphone" 
              value={formData.telephone} 
              onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
            />
            
            <button onClick={confirmerReservationFormulaire}>Confirmer la réservation</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;