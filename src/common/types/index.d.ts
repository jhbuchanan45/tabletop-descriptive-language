export type RefHandler = (missingRefs: { byId: string[]; byName: string[] }) => void;

export interface GenericOpts {
  refHandler?: RefHandler;
}
