const { compileFromFile } = require('json-schema-to-typescript');
const fs = require('fs');
const path = require('path');

// compile from file
compileFromFile(path.join(__dirname, '../schema/dnd5e.schema.json')).then((ts) =>
  fs.writeFileSync(path.join(__dirname, 'dnd5e.d.ts'), ts)
);
