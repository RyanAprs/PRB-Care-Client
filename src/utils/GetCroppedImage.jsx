export const getCroppedImg = (image, crop) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;

  const ctx = canvas.getContext("2d");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const aspectRatio = crop.width / crop.height;

  let targetWidth = 1200;
  let targetHeight = 1200 / aspectRatio;

  if (targetHeight > 630) {
    targetHeight = 630;
    targetWidth = 630 * aspectRatio;
  }

  const offsetX = (1200 - targetWidth) / 2;
  const offsetY = (630 - targetHeight) / 2;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    offsetX,
    offsetY,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Gagal memotong gambar."));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
};
