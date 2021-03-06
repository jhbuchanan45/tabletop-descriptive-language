import { ErrorObject } from 'ajv';
import { MissingRefs } from './types';

export class UnresolvedRefError extends Error {
  missingRefs: MissingRefs;

  constructor(missingRefs: MissingRefs) {
    const description = `Unable to resolve these references by ID, (${missingRefs.id.join(
      ' ,'
    )}), and/or these by name reference, (${missingRefs.name.join(' ,')})`;

    super(description);
    this.missingRefs = missingRefs;

    Error.captureStackTrace(this);
  }
}

export class TypeValidationError extends Error {
  constructor(type: string) {
    const description = `Validation failed for adding item with type ${type}`;

    super(description);

    Error.captureStackTrace(this);
  }
}

export class InvalidRefError extends Error {
  constructor(ref: string) {
    const description = `Reference '${ref}' failed to split into correct components`;

    super(description);

    Error.captureStackTrace(this);
  }
}

export class AjvValidationError extends Error {
  ajvErrors: ErrorObject[] | string;

  constructor(ajvErrors?: ErrorObject[] | null) {
    let description;

    if (ajvErrors) {
      description = `Schema validation failed with the following errors: \n${ajvErrors
        .map((error) => error.message)
        .join('\n')}`;
    } else {
      description = 'Schema validation failed with unknow errors';
    }
    super(description);

    this.ajvErrors = ajvErrors || 'Unknown';

    Error.captureStackTrace(this);
  }
}
