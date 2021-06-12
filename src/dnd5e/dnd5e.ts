// import tokenSchema from './schema/token.schema.json';
import yaml from 'js-yaml';
import ajv from './schema/validation';
import { AjvValidationError, TypeValidationError, UnresolvedRefError } from '../common/errors';
import Token from './token';
import type { Token as TokenJSON, Class as ClassJSON, Race as RaceJSON } from './types/dnd5e';
import Class from './class';
import Race from './race';
import type { RefHandler } from '../common/types/index';
import parseReference from '../common/parseReference';

class CategoryMap<ObjectStore> {
  private byID: Map<string, unknown>;
  private byName: Map<string, ObjectStore>;

  constructor(idMap) {
    this.byID = idMap;
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
  private idMap: Map<string, unknown>;
  private tokens: CategoryMap<Token>;
  private classes: CategoryMap<Class>;
  private races: CategoryMap<Race>;
  private subclasses: CategoryMap<unknown>;
  private items: CategoryMap<unknown>;
  private spells: CategoryMap<unknown>;
  private refHandler: RefHandler;

  constructor(opts: DND5eOpts = {}) {
    this.idMap = new Map();
    this.tokens = new CategoryMap(this.idMap);
    this.classes = new CategoryMap(this.idMap);
    this.races = new CategoryMap(this.idMap);
    this.subclasses = new CategoryMap(this.idMap);
    this.items = new CategoryMap(this.idMap);
    this.spells = new CategoryMap(this.idMap);

    if (opts.refHandler) {
      this.refHandler = opts.refHandler;
    } else {
      this.refHandler = (missingRefs) => {
        throw new UnresolvedRefError(missingRefs);
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private resolveReferences<T extends object>(
    objReferences: T,
    objResolved: T,
    refPaths: string[]
  ) {
    refPaths.forEach((path) => {
      const reference = objReferences[path];

      // idRef then nameRef then straight obj
      if (reference.idRef) {
        const [type, ref] = parseReference(reference.idRef);
        console.log(type, ref);
      }
    });

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

      const token = new Token(parsedTokenJSON, this.resolveReferences);
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
