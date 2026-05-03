import { execSync } from 'child_process';
import { readdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const dirs = [
  'public/images/candidates',
  'public/images'
];

dirs.forEach(dir => {
  const files = readdirSync(dir);
  files.forEach(file => {
    if (extname(file).toLowerCase() === '.png') {
      const input = join(dir, file).replace(/\\/g, '/');
      const outputDir = dir.replace(/\\/g, '/');
      console.log(`Converting ${input}...`);
      try {
        execSync(`npx sharp-cli -i ${input} -o ${outputDir}/ --format jpg -q 80`, { stdio: 'inherit' });
        // Optionally delete the png after conversion
        // unlinkSync(join(dir, file));
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err.message);
      }
    }
  });
});
