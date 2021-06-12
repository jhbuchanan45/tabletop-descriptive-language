import type { Class as ClassJSON } from './types/dnd5e';
import type { GenericOpts } from '../common/types';

type ClassOpts = Readonly<GenericOpts>;

export default class Class {
  private classOpts: ClassOpts;
  private originalClass: Readonly<ClassJSON>;

  constructor(inputClass: ClassJSON, classOpts: ClassOpts = {}) {
    this.classOpts = classOpts;
    this.originalClass = inputClass;
  }
}
