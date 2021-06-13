import type { GenericOpts, RefPaths, RefResolver } from '../../common/types';
import v8 from 'v8';

export abstract class DND5eGeneric<Tjson, Topts = GenericOpts> {
  protected opts: GenericOpts;
  protected original: Readonly<Tjson>;
  protected resolved: Tjson;
  protected refPaths: RefPaths<Tjson> = [];
  public resolveReferences: () => void;

  constructor(inputObj: Tjson, resolveReferences: RefResolver<Tjson>, opts?: GenericOpts) {
    this.opts = opts || {};
    this.original = inputObj;
    this.resolved = v8.deserialize(v8.serialize(inputObj));
    this.resolveReferences = () => resolveReferences(this.original, this.resolved, this.refPaths);
  }

  public getResolved(): Tjson {
    return this.resolved;
  }
}
