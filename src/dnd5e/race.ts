import type { Race as RaceJSON } from './types/dnd5e';
import type { GenericOpts } from '../common/types';

type RaceOpts = GenericOpts;

export default class Race {
  private raceOpts: RaceOpts;
  private originalRace: Readonly<RaceJSON>;

  constructor(inputRace: RaceJSON, raceOpts: RaceOpts = {}) {
    this.raceOpts = raceOpts;
    this.originalRace = inputRace;
  }
}
