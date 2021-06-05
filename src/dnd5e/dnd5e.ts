// import tokenSchema from './schema/token.schema.json';
// import yaml from 'js-yaml';

class CategoryMap {
  public byID: Map<string, Record<string, unknown>>;
  public byName: Map<string, unknown>;

  constructor() {
    this.byID = new Map();
    this.byName = new Map();
  }
}

class dnd5e {
  private token: CategoryMap;
  private race: CategoryMap;
  private class: CategoryMap;
  private subclass: CategoryMap;
  private item: CategoryMap;
  private spell: CategoryMap;

  constructor() {
    this.token = new CategoryMap();
    this.race = new CategoryMap();
    this.class = new CategoryMap();
    this.subclass = new CategoryMap();
    this.item = new CategoryMap();
    this.spell = new CategoryMap();
  }
}

export { dnd5e };

export default dnd5e;
