import Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

import configSchema from '@/content/schema/config.schema.json';
import workSchema from '@/content/schema/work.schema.json';

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const validators: Record<string, ValidateFunction> = {
  'content/config.json': ajv.compile(configSchema),
  'content/work.json': ajv.compile(workSchema),
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
