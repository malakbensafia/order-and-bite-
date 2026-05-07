import { imagesMap } from "../assets/assets";

export const getImageSrc = (image) => {

  if (!image) return "/images/default.png";

  // si image URL (cloud, supabase, etc.)
  if (image.startsWith("http")) {
    return image;
  }

  // image locale (ton imagesMap)
  return imagesMap[image] || "/images/default.png";
};