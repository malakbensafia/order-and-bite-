import { assets } from "../assets/assets";

/* =========================
   1. PROMO ACTIVE ?
========================= */
export const isPromoActive = (promo) => {
  if (!promo) return false;

  const now = new Date();

  const debut = new Date(promo.datedebutpromo);
  const fin = new Date(promo.datefinpromo);

  // 👇 Met fin à 23h59 pour couvrir toute la journée
  fin.setHours(23, 59, 59, 999);

  return now >= debut && now <= fin;
};

/* =========================
   2. PRIX FINAL
========================= */
export const getFinalPrice = (plat) => {
  const price = Number(plat?.prix) || 0; // 🔥 sécurité

  const promo = plat?.promotionplat?.[0];

  if (!promo || !isPromoActive(promo)) {
    return price;
  }

  const reduction = Number(promo.tauxreduction) || 0;

  return Math.round(price - (price * reduction) / 100);
};

/* =========================
   3. BADGE IMAGE
========================= */

/* =========================
   BADGE PROMO (CORRIGÉ)
========================= */
export const getPromoBadgeImage = (promo) => {
  if (!promo) return null;

  const t = Math.round(Number(promo.tauxreduction)); // 💥 IMPORTANT

  if (t >= 70) return assets.discount75;
  if (t >= 50) return assets.discount50;
  if (t >= 20) return assets.discount20;
  if (t >= 15) return assets.discount15;
  if (t >= 10) return assets.discount10;

  return null;
};