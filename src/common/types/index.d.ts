/* eslint-disable @typescript-eslint/ban-types */
export type RefHandler = (missingRefs: { byId: string[]; byName: string[] }) => void;

// Reference https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object/58436959#58436959
// Through line 26

// prettier-ignore
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
    }[keyof T]
  : '';

export type RefPaths<T> = Paths<T>[];

export interface GenericOpts {
  refHandler?: RefHandler;
}

export type RefResolver<T> = (objReferences: T, objResolved: T, refPaths: RefPaths<T>) => void;
