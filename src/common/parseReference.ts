import { InvalidRefError } from './errors';

export default (ref: string): [string, string] => {
  const type = ref.match(/^\w+/);
  const refString = ref.match(/(?<=\()(\w|\d|-)+(?=\))/);
  console.log(type, refString);
  if (!type || !refString || !(typeof type[0] === 'string' && typeof refString[0] === 'string')) {
    throw new InvalidRefError(ref);
  }
  return [type[0], refString[0]];
};
