const fs = require('fs');
const file = process.argv[2];

const mongoexport = fs.readFileSync(file, "utf8");
let split = mongoexport.split('{');
let output = [];
for (var i = 1; i < split.length; i++) {
    output.push('{' + split[i]);
}
output = '[' + output.join() + ']';
console.log(output);