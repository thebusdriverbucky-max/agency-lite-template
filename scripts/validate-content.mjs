import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.cwd();

const targets = [
  {
    dataPath: 'content/config.json',
    schemaPath: 'content/schema/config.schema.json',
  },
  {
    dataPath: 'content/work.json',
    schemaPath: 'content/schema/work.schema.json',
  },
];

async function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);

  try {
    return JSON.parse(await readFile(absolutePath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${relativePath}: invalid JSON (${message})`);
  }
}

function formatErrors(file, errors = []) {
  return errors.map((error) => {
    const location = error.instancePath || '/';
    const property = error.params?.additionalProperty
      ? ` (${error.params.additionalProperty})`
      : '';

    return `${file}${location}${property}: ${error.message ?? 'invalid value'}`;
  });
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const failures = [];
const content = new Map();

for (const target of targets) {
  try {
    const [data, schema] = await Promise.all([
      readJson(target.dataPath),
      readJson(target.schemaPath),
    ]);
    const validate = ajv.compile(schema);

    if (!validate(data)) {
      failures.push(...formatErrors(target.dataPath, validate.errors));
    }

    content.set(target.dataPath, data);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }
}

const work = content.get('content/work.json');
if (Array.isArray(work)) {
  const seenIds = new Set();

  work.forEach((project, index) => {
    if (project && typeof project.id === 'string') {
      if (seenIds.has(project.id)) {
        failures.push(
          `content/work.json/${index}/id: duplicate project id "${project.id}"`,
        );
      }
      seenIds.add(project.id);
    }
  });
}

if (failures.length > 0) {
  console.error('Content validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Content validation passed for config.json and work.json.');
