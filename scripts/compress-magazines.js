const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const magazinesDir = path.join(__dirname, '../public/magazines');

async function compressMagazines() {
  const magazines = fs.readdirSync(magazinesDir);

  for (const mag of magazines) {
    const magPath = path.join(magazinesDir, mag);
    if (!fs.statSync(magPath).isDirectory()) continue;

    const files = fs.readdirSync(magPath).filter(f => f.endsWith('.webp'));

    for (const file of files) {
      const filePath = path.join(magPath, file);
      const tempPath = path.join(magPath, `temp_${file}`);
      
      try {
        await sharp(filePath)
          .resize({ width: 1200 }) // Cap width at 1200px (plenty for a book page)
          .webp({ quality: 75, effort: 6 }) // 75% quality is visually lossless for text/magazines
          .toFile(tempPath);

        // Replace original with compressed version
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        const stats = fs.statSync(filePath);
        console.log(`✅ ${file}: ${(stats.size / 1024).toFixed(1)} KB`);
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    }
  }
  console.log('🚀 Magazine compression complete!');
}

compressMagazines();