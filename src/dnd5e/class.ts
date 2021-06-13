import type { Class as ClassJSON } from './types/dnd5e';
import type { GenericOpts, RefPaths, RefResolver } from '../common/types';
import v8 from 'v8';

type ClassOpts = Readonly<GenericOpts>;

export default class Class {
  private classOpts: ClassOpts;
  private originalClass: Readonly<ClassJSON>;
  private resolvedClass: ClassJSON;
  private refPaths: RefPaths<ClassJSON> = [];
  public resolveReferences: () => void;

  constructor(
    inputClass: ClassJSON,
    resolveReferences: RefResolver<ClassJSON>,
    classOpts: ClassOpts = {}
  ) {
    this.classOpts = classOpts;
    this.originalClass = inputClass;
    this.resolvedClass = v8.deserialize(v8.serialize(inputClass));
    this.resolveReferences = () =>
      resolveReferences(this.originalClass, this.resolvedClass, this.refPaths);

    this.resolveReferences();
  }

  public getResolved(): ClassJSON {
    return this.originalClass;
  }
}
