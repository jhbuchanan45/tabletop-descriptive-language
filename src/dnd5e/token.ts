import type { Token as TokenJSON } from './types/dnd5e';

export class Token {
  private originalToken: Readonly<TokenJSON>;

  constructor(inputToken: TokenJSON) {
    this.originalToken = inputToken;
  }
}
