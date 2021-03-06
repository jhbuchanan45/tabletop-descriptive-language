const { DND5e } = require('../');
const dnd5e = new DND5e();
const fs = require('fs');
const path = require('path');

const exampleToken = fs.readFileSync(path.join(__dirname, './token.dnd5e.ttdl.yml')).toString();

const exampleClass = fs.readFileSync(path.join(__dirname, './class.dnd5e.ttdl.yml')).toString();
dnd5e.addClass(exampleClass);

const exampleRace = fs.readFileSync(path.join(__dirname, './race.dnd5e.ttdl.yml')).toString();
dnd5e.addRace(exampleRace);

// add token last for reference resolving
dnd5e.addToken(exampleToken);

console.log(dnd5e.tokens);
console.log(dnd5e.classes);
console.log(dnd5e.races);

console.log(dnd5e.tokens.getByKey('eldridge').resolved.classes);

console.log('done');
