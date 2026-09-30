import type { ErrorObject, ValidateFunction } from 'ajv';

import {
  validateConfig,
  validateWork,
} from './content-validators.generated';

const validators: Record<string, ValidateFunction> = {
  'content/config.json': validateConfig as ValidateFunction,
  'content/work.json': validateWork as ValidateFunction,
};

function formatErrors(path: string, errors: ErrorObject[] | null | undefined): string {
  return (errors || []).map((error) => {
    const location = error.instancePath || '/';
    const property = 'additionalProperty' in error.params
      ? ` (${String(error.params.additionalProperty)})`
      : '';
    return `${path}${location}${property}: ${error.message || 'invalid value'}`;
  }).join('\n');
}

export function validateContentFile(path: string, data: unknown): void {
  const validate = validators[path];
  if (!validate) throw new Error(`No content schema is registered for "${path}".`);
  if (!validate(data)) throw new Error(formatErrors(path, validate.errors));

  if (path === 'content/work.json' && Array.isArray(data)) {
    const seenIds = new Set<string>();
    data.forEach((project, index) => {
      const id = project && typeof project === 'object' && 'id' in project
        ? (project as { id?: unknown }).id
        : null;
      if (typeof id === 'string' && seenIds.has(id)) {
        throw new Error(`${path}/${index}/id: duplicate project id "${id}"`);
      }
      if (typeof id === 'string') seenIds.add(id);
    });
  }
}
