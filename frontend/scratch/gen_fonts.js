const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'noto.ttf');
const outputPath = path.join(__dirname, '..', 'lib', 'fonts.ts');

const fontData = fs.readFileSync(fontPath);
const base64Font = fontData.toString('base64');

const content = `// This file is auto-generated. Do not edit manually.
export const NOTO_SANS_DEVANAGARI_BASE64 = '${base64Font}';
`;

fs.writeFileSync(outputPath, content);
console.log('Successfully generated fonts.ts');
