import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const root = process.cwd();

async function source(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

test('browser content validation uses checked-in standalone validators', async () => {
  const validation = await source('lib/content-validation.ts');
  const generated = await source('lib/content-validators.generated.ts');
  const config = JSON.parse(await source('content/config.json'));
  const work = JSON.parse(await source('content/work.json'));

  assert.doesNotMatch(validation, /ajv\.compile\s*\(/);
  assert.match(validation, /validateConfig/);
  assert.match(validation, /validateWork/);
  assert.match(generated, /export const validateConfig/);
  assert.match(generated, /export const validateWork/);
  assert.doesNotMatch(generated, /\bnew Function\b|\beval\s*\(/);
  assert.doesNotMatch(generated, /\brequire\s*\(/);

  await execFileAsync(process.execPath, [
    'scripts/generate-content-validators.mjs',
    '--check',
  ], { cwd: root });

  const runtimeValidatorPath = path.join(
    root,
    'lib/.content-validators.regression.mjs',
  );
  await writeFile(runtimeValidatorPath, generated, 'utf8');
  try {
    const validatorModule = await import(
      `${pathToFileURL(runtimeValidatorPath).href}?regression=${Date.now()}`,
    );
    assert.equal(validatorModule.validateConfig(config), true);
    assert.equal(validatorModule.validateWork(work), true);
    assert.equal(validatorModule.validateConfig({}), false);
    assert.equal(validatorModule.validateWork([{ id: 'not valid!' }]), false);
  } finally {
    await unlink(runtimeValidatorPath);
  }
});

test('production CSP leaves unsafe-eval to development only', async () => {
  const nextConfig = await source('next.config.ts');

  assert.match(nextConfig, /process\.env\.NODE_ENV === "development"/);
  assert.match(nextConfig, /"'unsafe-eval'"/);
  assert.doesNotMatch(
    nextConfig,
    /script-src 'self' 'unsafe-inline' 'unsafe-eval'/,
  );
});

test('editable config fields are consumed by public pages', async () => {
  const files = {
    layout: await source('app/layout.tsx'),
    header: await source('components/layout/Header.tsx'),
    whatsapp: await source('components/layout/WhatsAppButton.tsx'),
    hero: await source('components/sections/Hero.tsx'),
    about: await source('components/sections/About.tsx'),
    services: await source('components/sections/Services.tsx'),
    portfolio: await source('components/sections/Portfolio.tsx'),
    contact: await source('components/sections/Contact.tsx'),
    privacy: await source('app/privacy-policy/page.tsx'),
    terms: await source('app/terms-of-service/page.tsx'),
  };

  const expectedUsages = [
    ['theme', files.layout, 'config.theme'],
    ['site name', files.header, 'config.site'],
    ['site metadata', files.layout, 'config.site.'],
    ['site colors', files.layout, 'config.site.colors.primary'],
    ['site colors secondary', files.layout, 'config.site.colors.secondary'],
    ['WhatsApp number', files.whatsapp, 'config.site.whatsapp'],
    ['WhatsApp message', files.whatsapp, 'config.site.whatsappMessage'],
    ['hero content', files.hero, 'hero.title'],
    ['hero background', files.hero, 'hero.backgroundImage'],
    ['hero image opacity', files.hero, 'hero.imageOpacity'],
    ['hero section opacity', files.hero, 'hero.opacity'],
    ['hero link', files.hero, 'hero.link'],
    ['about content', files.about, 'about.text'],
    ['about display controls', files.about, 'about.opacity'],
    ['services display controls', files.services, 'servicesConfig?.link'],
    ['service items', files.services, 'service.description'],
    ['portfolio display controls', files.portfolio, 'portfolioConfig?.link'],
    ['contact title', files.contact, 'contact.title'],
    ['contact subtitle', files.contact, 'contact.subtitle'],
    ['contact email', files.contact, 'contact.email'],
    ['contact button', files.contact, 'contact.buttonText'],
    ['contact display controls', files.contact, 'contact.opacity'],
  ];

  for (const [label, content, field] of expectedUsages) {
    assert.match(content, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), label);
  }

  assert.match(files.privacy, /privacyData\.title/);
  assert.match(files.privacy, /privacyData\.text/);
  assert.match(files.terms, /termsData\.title/);
  assert.match(files.terms, /termsData\.text/);
});

test('all work fields remain rendered by the public portfolio', async () => {
  const portfolio = await source('components/sections/Portfolio.tsx');

  for (const field of ['project.id', 'project.title', 'project.category', 'project.description', 'project.image']) {
    assert.match(portfolio, new RegExp(field.replace('.', '\\.'), 'u'), field);
  }
});

test('checked-in content still passes schema and duplicate-id validation', async () => {
  await execFileAsync(process.execPath, ['scripts/validate-content.mjs'], { cwd: root });
});
