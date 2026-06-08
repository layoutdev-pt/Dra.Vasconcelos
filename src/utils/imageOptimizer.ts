import imageCompression from 'browser-image-compression';

/**
 * Optimizes an image for upload by reducing its size and converting it to WebP.
 * - Max width/height: 1920px
 * - Format: WebP
 * - Initial Quality: 0.8
 */
export const optimizeImageForUpload = async (file: File): Promise<File> => {
  // If the file is not an image, return it as is
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: 1, // Target size is max 1MB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // Ensure the new file has the correct .webp extension
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const newFileName = `${nameWithoutExt}.webp`;
    
    return new File([compressedFile], newFileName, { type: 'image/webp' });
  } catch (error) {
    console.error('Error compressing image:', error);
    // Fallback to the original file if compression fails
    return file;
  }
};
