const { Dnd5e } = require('ttdl');
const dnd5e = new Dnd5e();
const fs = require('fs');
const path = require('path');

const exampleToken = fs.readFileSync(path.join(__dirname, '../src/dnd5e/example.dnd5e.ttdl.yml'));
dnd5e.addToken(exampleToken);

console.log('done');
