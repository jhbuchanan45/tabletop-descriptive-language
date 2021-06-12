import type { Token as TokenJSON } from './types/dnd5e';
import type { GenericOpts, RefPaths, RefResolver } from '../common/types';
import v8 from 'v8';

type TokenOpts = Readonly<GenericOpts>;

export default class Token {
  private tokenOpts: TokenOpts;
  private originalToken: Readonly<TokenJSON>;
  private resolvedToken: TokenJSON;
  private refPaths: RefPaths<TokenJSON> = ['race', 'classes'];
  public resolveReferences: () => void;

  constructor(
    inputToken: TokenJSON,
    resolveReferences: RefResolver<TokenJSON>,
    tokenOpts: TokenOpts = {}
  ) {
    this.tokenOpts = tokenOpts;
    this.originalToken = inputToken;
    this.resolvedToken = v8.deserialize(v8.serialize(inputToken));
    this.resolveReferences = () =>
      resolveReferences(this.originalToken, this.resolvedToken, this.refPaths);

    this.resolveReferences();
  }
}
