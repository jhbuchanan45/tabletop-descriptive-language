const { DND5e } = require('../');
const dnd5e = new DND5e();
const fs = require('fs');
const path = require('path');

const exampleToken = fs
  .readFileSync(path.join(__dirname, '../src/dnd5e/example.dnd5e.ttdl.yml'))
  .toString();
dnd5e.addToken(exampleToken);

console.log(dnd5e.tokens);

console.log('done');
