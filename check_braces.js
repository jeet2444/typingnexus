const fs = require('fs');

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

let balance = 0;
let stack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') {
            balance++;
            stack.push(i + 1);
        } else if (char === '}') {
            balance--;
            stack.pop();
        }
    }
    if (balance < 0) {
        console.log(`Error: Extra closing brace at line ${i + 1}`);
        process.exit(1);
    }
}

if (balance > 0) {
    console.log(`Error: Unclosed brace starting at line ${stack[stack.length - 1]}`);
    console.log(`Total unclosed braces: ${balance}`);
} else {
    console.log('Braces are balanced.');
}
