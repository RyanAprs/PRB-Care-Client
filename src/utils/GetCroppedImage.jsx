export const getCroppedImg = (image, crop) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; 
  canvas.height = 630;

  const ctx = canvas.getContext("2d");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    1200,
    630
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Gagal memotong gambar."));
        return;
      }
      resolve(blob);
    }, "image/webp");
  });
};
