// ================= CALCUL DISTANCE (Haversine) =================
export const calculerDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// ================= FRAIS DE LIVRAISON =================
export const calculerFraisLivraison = (distanceKm) => {
    if (distanceKm <= 1)  return 50;
    if (distanceKm <= 3)  return 100;
    if (distanceKm <= 7)  return 200;
    if (distanceKm <= 15) return 350;
    return 500;
};