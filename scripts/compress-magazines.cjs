const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../public/magazines');
const outputDir = path.join(__dirname, '../public/magazines_compressed');

async function compressMagazines() {
  if (!fs.existsSync(inputDir)) {
    console.log("No magazines directory found.");
    return;
  }

  // Create the new output folder
  if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true });
  fs.mkdirSync(outputDir);

  const magazines = fs.readdirSync(inputDir);

  for (const mag of magazines) {
    const magInputPath = path.join(inputDir, mag);
    if (!fs.statSync(magInputPath).isDirectory()) continue;

    // Create matching folder in output directory
    const magOutputPath = path.join(outputDir, mag);
    fs.mkdirSync(magOutputPath);

    const files = fs.readdirSync(magInputPath).filter(f => f.endsWith('.webp'));

    for (const file of files) {
      const inputFilePath = path.join(magInputPath, file);
      const outputFilePath = path.join(magOutputPath, file);
      
      try {
        await sharp(inputFilePath)
          .resize({ width: 1200 })
          .webp({ quality: 75, effort: 6 })
          .toFile(outputFilePath); // Write to the NEW folder
        
        const stats = fs.statSync(outputFilePath);
        console.log(`✅ ${mag}/${file}: ${(stats.size / 1024).toFixed(1)} KB`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }
  }
  console.log('\n🚀 Magazine compression complete!');
  console.log('➡️  Next steps: Delete the old "magazines" folder and rename "magazines_compressed" to "magazines".');
}

compressMagazines();