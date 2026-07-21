const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'src/assets/images');
const imagesToOptimize = ['courses_hero.png', 'book_hero.png', 'dra_hero.png', 'Palestra Online Gratuita.jpeg', 'curso1.jpg', 'curso2.png', 'curso3.webp', 'dra.jpg', 'dra2.jpg', 'dra3.jpg', 'dra4.jpg'];

async function optimizeImages() {
  console.log('Optimizing images...');
  for (const file of imagesToOptimize) {
    const inputPath = path.join(imagesDir, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} - not found`);
      continue;
    }
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const outputPath = path.join(imagesDir, `${base}.webp`);
    
    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Optimized: ${file} -> ${base}.webp`);
      
      // If the original was not webp, we should delete it or just keep it and let the script handle it.
      // Better to keep for now and we will delete manually via git or command to track.
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
    }
  }
}

optimizeImages();
