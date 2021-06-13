import type { Race as RaceJSON } from './types/dnd5e';
import type { GenericOpts, RefPaths, RefResolver } from '../common/types';
import v8 from 'v8';

type RaceOpts = Readonly<GenericOpts>;

export default class Race {
  private raceOpts: RaceOpts;
  private originalRace: Readonly<RaceJSON>;
  private resolvedRace: RaceJSON;
  private refPaths: RefPaths<RaceJSON> = [];
  public resolveReferences: () => void;

  constructor(
    inputRace: RaceJSON,
    resolveReferences: RefResolver<RaceJSON>,
    raceOpts: RaceOpts = {}
  ) {
    this.raceOpts = raceOpts;
    this.originalRace = inputRace;
    this.resolvedRace = v8.deserialize(v8.serialize(inputRace));
    this.resolveReferences = () =>
      resolveReferences(this.originalRace, this.resolvedRace, this.refPaths);

    this.resolveReferences();
  }

  public getResolved(): RaceJSON {
    return this.originalRace;
  }
}
