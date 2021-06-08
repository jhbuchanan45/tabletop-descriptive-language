// import tokenSchema from './schema/token.schema.json';
import yaml from 'js-yaml';
import ajv from './schema/validation';

class CategoryMap {
  public byID: Map<string, Record<string, unknown>>;
  public byName: Map<string, unknown>;

  constructor() {
    this.byID = new Map();
    this.byName = new Map();
  }

  public set(obj: Record<string, unknown>, id: string, name: string) {
    this.byID.set(id, obj);
    this.byName.set(name, obj);
  }

  public getByKey(key: string) {
    return this.byID[key] || this.byName[key] || null;
  }
}

class Dnd5e {
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

  public addToken(...newToken: string[]): void {
    // validate tokens
    newToken.forEach((tokenYML) => {
      const token = yaml.load(tokenYML);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof token === 'object' && (token as any)?.type === 'token') {
        ajv.validate('schema', token);
      }

      console.log(token);
    });
  }

  // public addClass(newClass: string) {}
}

export { Dnd5e };
export default Dnd5e;
