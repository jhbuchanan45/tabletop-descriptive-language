import Ajv from 'ajv';
const ajv = new Ajv();

import schema from './dnd5e.schema.json';
ajv.addSchema(schema, 'schema');

export default ajv;
