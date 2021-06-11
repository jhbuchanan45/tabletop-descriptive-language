import type { Token as TokenJSON } from './types/dnd5e';
import type { GenericOpts } from '../common/types';

type TokenOpts = GenericOpts;

export default class Token {
  private tokenOpts: TokenOpts;
  private originalToken: Readonly<TokenJSON>;

  constructor(inputToken: TokenJSON, tokenOpts: TokenOpts = {}) {
    this.tokenOpts = tokenOpts;
    this.originalToken = inputToken;
  }
}
