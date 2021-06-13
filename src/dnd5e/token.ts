import type { Token as TokenJSON } from './types/dnd5e';
import type { GenericOpts, RefResolver } from '../common/types';
import { DND5eGeneric } from './types/genericObject';

type TokenOpts = Readonly<GenericOpts>;

export default class Token extends DND5eGeneric<TokenJSON, TokenOpts> {
  constructor(inputObj: TokenJSON, resolveReferences: RefResolver<TokenJSON>, opts?: TokenOpts) {
    super(inputObj, resolveReferences, opts);

    this.refPaths = ['race', 'classes'];
  }
}
