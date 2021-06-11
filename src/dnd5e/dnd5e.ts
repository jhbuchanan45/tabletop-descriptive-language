// import tokenSchema from './schema/token.schema.json';
import yaml from 'js-yaml';
import ajv from './schema/validation';
import { AjvValidationError, TypeValidationError, UnresolvedRefError } from '../common/errors';
import Token from './token';
import type { Token as TokenJSON, Class as ClassJSON, Race as RaceJSON } from './types/dnd5e';
import Class from './class';
import Race from './race';
import type { RefHandler } from '../common/types/index';

class CategoryMap<ObjectStore> {
  private byID: Map<string, ObjectStore>;
  private byName: Map<string, ObjectStore>;

  constructor() {
    this.byID = new Map();
    this.byName = new Map();
  }

  public set(obj: ObjectStore, name: string, id?: string) {
    if (id) this.byID.set(id, obj);
    if (name) this.byName.set(name, obj);
  }

  public getByKey(key: string) {
    return this.byID[key] || this.byName[key] || null;
  }
}

type DND5eOpts = {
  refHandler?: RefHandler;
};

class DND5e {
  private tokens: CategoryMap<Token>;
  private classes: CategoryMap<Class>;
  private races: CategoryMap<Race>;
  private subclasses: CategoryMap<unknown>;
  private items: CategoryMap<unknown>;
  private spells: CategoryMap<unknown>;
  private refHandler: RefHandler;

  constructor(opts: DND5eOpts = {}) {
    this.tokens = new CategoryMap();
    this.classes = new CategoryMap();
    this.races = new CategoryMap();
    this.subclasses = new CategoryMap();
    this.items = new CategoryMap();
    this.spells = new CategoryMap();

    if (opts.refHandler) {
      this.refHandler = opts.refHandler;
    } else {
      this.refHandler = (missingRefs) => {
        throw new UnresolvedRefError(missingRefs);
      };
    }
  }

  private resolveReferences() {
    return;
  }

  private validateObject<ObjectType>(obj: ObjectType, type?: string) {
    if (!obj || typeof obj === 'string' || typeof obj === 'number')
      throw new Error('No valid token present');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!type || (obj as any)?.type === type) {
      const valid = ajv.validate('schema', obj);
      if (!valid) throw new AjvValidationError(ajv.errors);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new TypeValidationError((obj as any).type);
    }
  }

  public addToken(...newTokens: [string | TokenJSON]): void {
    // validate tokens
    newTokens.forEach((tokenRAW) => {
      const tokenJSON = typeof tokenRAW === 'string' ? yaml.load(tokenRAW) : tokenRAW;

      this.validateObject(tokenJSON, 'token');
      const parsedTokenJSON = tokenJSON as TokenJSON;

      const token = new Token(parsedTokenJSON);
      this.tokens.set(token, parsedTokenJSON.refName, parsedTokenJSON.ID);
    });
  }

  public addClass(...newClasses: [string | ClassJSON]): void {
    // validate tokens
    newClasses.forEach((classRAW) => {
      const classJSON = typeof classRAW === 'string' ? yaml.load(classRAW) : classRAW;

      this.validateObject(classJSON, 'class');
      const parsedClassJSON = classJSON as ClassJSON;

      const classs = new Class(parsedClassJSON);
      this.classes.set(classs, parsedClassJSON.refName, parsedClassJSON.ID);
    });
  }

  public addRace(...newRaces: [string | RaceJSON]): void {
    // validate tokens
    newRaces.forEach((raceRAW) => {
      const raceJSON = typeof raceRAW === 'string' ? yaml.load(raceRAW) : raceRAW;

      this.validateObject(raceJSON, 'race');
      const parsedRaceJSON = raceJSON as RaceJSON;

      const race = new Race(parsedRaceJSON);
      this.races.set(race, parsedRaceJSON.refName, parsedRaceJSON.ID);
    });
  }
}

export { DND5e };
export default DND5e;
