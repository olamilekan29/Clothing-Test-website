import { supabase } from "../supabase";

const BUCKET = "product-images";

const pathFromUrl = (url) =>
  decodeURIComponent((url.split(`/${BUCKET}/`)[1] || "").split("?")[0]);

async function resizeImage(file, maxSide = 1200) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; // transparent PNGs get a white background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process this image"))),
      "image/jpeg",
      0.85
    )
  );
}

export async function uploadImage(file) {
  const blob = await resizeImage(file);
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function removeImages(urls) {
  const paths = urls.map(pathFromUrl).filter(Boolean);
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
}