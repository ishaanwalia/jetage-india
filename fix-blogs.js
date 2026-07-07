const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'data', 'blogs.ts');

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Count replacements
let count = 0;

// Replace \\*\\* with **
content = content.replace(/\\\\\\*\\*/g, () => { count++; return '**'; });

// Replace \\* with *
content = content.replace(/\\\\\\*/g, () => { count++; return '*'; });

// Replace \\| with |
content = content.replace(/\\\\\\\|/g, () => { count++; return '|'; });

// Replace \\- with -
content = content.replace(/\\\\\\-/g, () => { count++; return '-'; });

// Replace \\[ with [
content = content.replace(/\\\\\\\[/g, () => { count++; return '['; });

// Replace \\] with ]
content = content.replace(/\\\\\\\]/g, () => { count++; return ']'; });

// Replace \\( with (
content = content.replace(/\\\\\\\(/g, () => { count++; return '('; });

// Replace \\) with )
const before8 = content.length;
content = content.replace(/\\\\\\\)/g, ')');
replacements += before8 - content.length;

// Replace \\` with `
const before9 = content.length;
content = content.replace(/\\\\\\\`/g, '`');
replacements += before9 - content.length;

fs.writeFileSync(filePath, content);
console.log(`Fixed ${replacements} escaped characters in blogs.ts`);