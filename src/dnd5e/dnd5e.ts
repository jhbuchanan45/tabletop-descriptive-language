// import tokenSchema from './schema/token.schema.json';
import yaml from 'js-yaml';
import ajv from './schema/validation';
import {
  AjvValidationError,
  InvalidRefError,
  TypeValidationError,
  UnresolvedRefError
} from '../common/errors';
import Token from './token';
import type { Token as TokenJSON, Class as ClassJSON, Race as RaceJSON } from './types/dnd5e';
import Class from './class';
import Race from './race';
import type { MissingRefs, RefHandler } from '../common/types/index';
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
    return this.byID.get(key) || this.byName.get(key) || null;
  }
}

type DND5eOpts = {
  refHandler?: RefHandler;
  refHandlerAttempts?: number;
};

class DND5e {
  private idMap: Map<string, unknown>;
  private tokens: CategoryMap<Token>;
  private classes: CategoryMap<Class>;
  private races: CategoryMap<Race>;
  private subclasses: CategoryMap<unknown>;
  private items: CategoryMap<unknown>;
  private spells: CategoryMap<unknown>;
  private opts: DND5eOpts;
  private refHandler: RefHandler;

  constructor(opts: DND5eOpts = {}) {
    this.idMap = new Map();
    this.tokens = new CategoryMap(this.idMap);
    this.classes = new CategoryMap(this.idMap);
    this.races = new CategoryMap(this.idMap);
    this.subclasses = new CategoryMap(this.idMap);
    this.items = new CategoryMap(this.idMap);
    this.spells = new CategoryMap(this.idMap);

    this.opts = opts;
    if (opts.refHandler) {
      this.refHandler = opts.refHandler;
    } else {
      this.refHandler = (missingRefs) => {
        throw new UnresolvedRefError(missingRefs);
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private resolveReferences = <T extends object>(
    dnd5e: DND5e,
    objReferences: T,
    objResolved: T,
    refPaths: string[]
  ) => {
    const resolveAll = () => {
      const missingRefs: MissingRefs = {
        id: [],
        name: []
      };

      const resolveRef = (possibleRef) => {
        let type: string, ref: string;

        // idRef then nameRef handled in getByKey(ref)
        if (possibleRef.ref) {
          [type, ref] = parseReference(possibleRef.ref);
        } else {
          // object must be inline or blank
          return possibleRef;
        }

        const idSpecified = ref.startsWith('id:');
        if (idSpecified) {
          // cleanup ref for searching
          ref = ref.substring(3);
        }

        // get object from correct store
        let referencedObject;
        switch (type) {
          case 'token':
            referencedObject = dnd5e.tokens.getByKey(ref);
            break;
          case 'class':
            referencedObject = dnd5e.classes.getByKey(ref);
            break;
          case 'race':
            referencedObject = dnd5e.races.getByKey(ref);
            break;
          case 'subclass':
            referencedObject = dnd5e.subclasses.getByKey(ref);
            break;
          case 'item':
            referencedObject = dnd5e.items.getByKey(ref);
            break;
          case 'spell':
            referencedObject = dnd5e.spells.getByKey(ref);
            break;
          default:
            throw new InvalidRefError(type);
        }

        if (!referencedObject) {
          if (idSpecified) {
            missingRefs.id.push([type, 'id:' + ref]);
          } else {
            missingRefs.name.push([type, ref]);
          }
        } else {
          // insert referenced object into resolvedObject
          // OVERWRITES EXISTING DATA?
          return referencedObject.getResolved();
        }
      };

      // check each path, if array resolve each child ref in .map()
      refPaths.forEach((path): void => {
        const refObject = objReferences[path];

        if (refObject instanceof Array) {
          objResolved[path] = refObject.map((childRef) => resolveRef(childRef));
        } else {
          objResolved[path] = resolveRef(refObject);
        }
      });

      if (missingRefs.id.length !== 0 || missingRefs.name.length !== 0)
        throw new UnresolvedRefError(missingRefs);
    };

    for (let attempts = 0; attempts < (dnd5e.opts.refHandlerAttempts || 1); attempts++) {
      try {
        resolveAll();
      } catch (e) {
        if (e instanceof UnresolvedRefError) {
          this.refHandler(e.missingRefs);
        } else throw e;
      }
    }
  };

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

      const token = new Token(parsedTokenJSON, this.resolveReferences.bind(null, this));
      token.resolveReferences();

      this.tokens.set(token, parsedTokenJSON.refName, parsedTokenJSON.ID);
    });
  }

  public addClass(...newClasses: [string | ClassJSON]): void {
    // validate tokens
    newClasses.forEach((classRAW) => {
      const classJSON = typeof classRAW === 'string' ? yaml.load(classRAW) : classRAW;

      this.validateObject(classJSON, 'class');
      const parsedClassJSON = classJSON as ClassJSON;

      const classs = new Class(parsedClassJSON, this.resolveReferences.bind(null, this));
      classs.resolveReferences();

      this.classes.set(classs, parsedClassJSON.refName, parsedClassJSON.ID);
    });
  }

  public addRace(...newRaces: [string | RaceJSON]): void {
    // validate tokens
    newRaces.forEach((raceRAW) => {
      const raceJSON = typeof raceRAW === 'string' ? yaml.load(raceRAW) : raceRAW;

      this.validateObject(raceJSON, 'race');
      const parsedRaceJSON = raceJSON as RaceJSON;

      const race = new Race(parsedRaceJSON, this.resolveReferences.bind(null, this));
      race.resolveReferences();

      this.races.set(race, parsedRaceJSON.refName, parsedRaceJSON.ID);
    });
  }
}

export { DND5e };
export default DND5e;
