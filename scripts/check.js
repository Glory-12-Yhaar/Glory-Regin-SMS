const fs = require('fs');
const code = fs.readFileSync('c:/Users/OKRAH GLORIA/Desktop/SCH/script.js', 'utf8');
let inString = false;
let stringChar = '';
let stringStartLine = 0;
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let j = 0; j < line.length; j++) {
    let char = line[j];
    let prevChar = j > 0 ? line[j-1] : '';

    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      stringStartLine = i + 1;
    } else if (inString && char === stringChar && prevChar !== '\\') {
      inString = false;
    }
  }
}

if (inString) {
  console.log('Unclosed string starting at line:', stringStartLine);
  console.log(lines[stringStartLine - 1]);
} else {
  console.log('No unclosed string found (wait, maybe inside template?)');
}
