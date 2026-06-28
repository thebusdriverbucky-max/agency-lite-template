'use client';

import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import {
  type Config,
  type Project,
  type Work,
  THEME_OPTIONS,
  SERVICE_ICON_OPTIONS,
} from '@/lib/github';
import {
  Button,
  Card,
  CardHeader,
  Field,
  Select,
  TextArea,
  TextInput,
} from './ui';

interface Props {
  config: Config;
  work: Work;
  onConfigChange: (updater: (prev: Config) => Config) => void;
  onWorkChange: (updater: (prev: Work) => Work) => void;
}

const THEME_SWATCHES: Record<string, { bg: string; accent: string }> = {
  'dark-teal': { bg: '#0f172a', accent: '#14b8a6' },
  'dark-amber': { bg: '#0f172a', accent: '#f59e0b' },
  'light-slate': { bg: '#f8fafc', accent: '#475569' },
  'light-rose': { bg: '#fafafa', accent: '#e11d48' },
};

const IMAGE_HINT =
  'Paste a direct image URL (https://…). Local paths like /images/photo.jpg also work if you commit the file to /public.';

export default function ContentEditor({
  config,
  work,
  onConfigChange,
  onWorkChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Theme */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader
          title="Theme"
          description="Controls the site-wide color palette applied on the next deploy."
        />
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {THEME_OPTIONS.map((opt) => {
              const active = config.theme === opt.value;
              const sw = THEME_SWATCHES[opt.value];
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onConfigChange((prev) => ({ ...prev, theme: opt.value }))
                  }
                  className={`group flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${active
                    ? 'border-accent ring-1 ring-accent'
                    : 'border-text/10 hover:border-text/25'
                    }`}
                >
                  <span
                    className="flex h-12 w-full items-center justify-center rounded-lg"
                    style={{ backgroundColor: sw.bg }}
                  >
                    <span
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: sw.accent }}
                    />
                  </span>
                  <span className="text-xs font-medium text-text">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Site */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader
          title="Site"
          description="Global metadata used across the site — branding, SEO and social sharing."
        />
        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Site name" htmlFor="site-name">
              <TextInput
                id="site-name"
                value={config.site.name}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, name: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Site URL" htmlFor="site-url" hint="Canonical URL, e.g. https://example.com">
              <TextInput
                id="site-url"
                type="url"
                placeholder="https://example.com"
                value={config.site.url}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, url: e.target.value },
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Description" htmlFor="site-desc" hint="Used for search engines and social previews.">
            <TextArea
              id="site-desc"
              rows={2}
              value={config.site.description}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  site: { ...prev.site, description: e.target.value },
                }))
              }
            />
          </Field>

          <Field label="Logo" htmlFor="site-logo" hint={`Image URL for the header logo. ${IMAGE_HINT} Leave empty to show the site name as text.`}>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" />
              <TextInput
                id="site-logo"
                className="pl-9"
                placeholder="https://…"
                value={config.site.logo}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, logo: e.target.value },
                  }))
                }
              />
            </div>
          </Field>

          <Field label="OG image" htmlFor="site-og" hint={`Social share image (recommended 1200×630). ${IMAGE_HINT}`}>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" />
              <TextInput
                id="site-og"
                className="pl-9"
                placeholder="https://…"
                value={config.site.ogImage}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, ogImage: e.target.value },
                  }))
                }
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="SEO keywords" htmlFor="site-keywords" hint="Comma-separated words for search engines.">
              <TextInput
                id="site-keywords"
                value={(config.site.keywords ?? []).join(', ')}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: {
                      ...prev.site,
                      keywords: e.target.value
                        .split(',')
                        .map((k) => k.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </Field>
            <Field label="Twitter @handle" htmlFor="site-twitter" hint="Used for Twitter card metadata.">
              <TextInput
                id="site-twitter"
                placeholder="@yourhandle"
                value={config.site.twitter}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, twitter: e.target.value },
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Locale" htmlFor="site-locale" hint="Open Graph locale, e.g. en_US or ru_RU.">
            <TextInput
              id="site-locale"
              value={config.site.locale}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  site: { ...prev.site, locale: e.target.value },
                }))
              }
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="WhatsApp Number" htmlFor="site-whatsapp" hint="Enter full phone number with country code (numbers only, e.g., 79991234567). Leave empty to hide.">
              <TextInput
                id="site-whatsapp"
                placeholder="79991234567"
                value={config.site.whatsapp ?? ''}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, whatsapp: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="WhatsApp Message Template" htmlFor="site-whatsapp-msg" hint="Default text that will pre-fill the chat for the user.">
              <TextInput
                id="site-whatsapp-msg"
                placeholder="Hello! I'm interested in working with you."
                value={config.site.whatsappMessage ?? ''}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: { ...prev.site, whatsappMessage: e.target.value },
                  }))
                }
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Primary color" htmlFor="site-primary">
              <TextInput
                id="site-primary"
                value={config.site.colors.primary}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: {
                      ...prev.site,
                      colors: { ...prev.site.colors, primary: e.target.value },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Secondary color" htmlFor="site-secondary">
              <TextInput
                id="site-secondary"
                value={config.site.colors.secondary}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    site: {
                      ...prev.site,
                      colors: { ...prev.site.colors, secondary: e.target.value },
                    },
                  }))
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Hero */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader title="Hero" description="The first section visitors see." />
        <div className="space-y-5 px-6 py-6">
          <Field label="Title" htmlFor="hero-title">
            <TextInput
              id="hero-title"
              value={config.hero.title}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Subtitle" htmlFor="hero-subtitle">
            <TextArea
              id="hero-subtitle"
              rows={2}
              value={config.hero.subtitle}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="CTA button text" htmlFor="hero-cta">
            <TextInput
              id="hero-cta"
              value={config.hero.ctaText}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, ctaText: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Background image" htmlFor="hero-bg" hint={`Background image for the hero section. ${IMAGE_HINT} Leave empty for a plain background.`}>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" />
              <TextInput
                id="hero-bg"
                className="pl-9"
                placeholder="https://…"
                value={config.hero.backgroundImage}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, backgroundImage: e.target.value },
                  }))
                }
              />
            </div>
          </Field>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Services */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader
          title="Services"
          description="The list of services shown in the grid."
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                onConfigChange((prev) => ({
                  ...prev,
                  services: [
                    ...prev.services,
                    { title: 'New service', description: '', icon: 'Code' },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          }
        />
        <div className="space-y-4 px-6 py-6">
          {config.services.length === 0 && (
            <p className="text-sm text-text/50">No services yet. Add one to get started.</p>
          )}
          {config.services.map((service, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 rounded-xl border border-text/10 p-4 sm:grid-cols-[1fr_1fr_auto]"
            >
              <Field label="Title">
                <TextInput
                  value={service.title}
                  onChange={(e) =>
                    onConfigChange((prev) => ({
                      ...prev,
                      services: prev.services.map((s, i) =>
                        i === index ? { ...s, title: e.target.value } : s,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Icon">
                <Select
                  value={service.icon}
                  onChange={(e) =>
                    onConfigChange((prev) => ({
                      ...prev,
                      services: prev.services.map((s, i) =>
                        i === index ? { ...s, icon: e.target.value } : s,
                      ),
                    }))
                  }
                >
                  {SERVICE_ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="danger"
                  aria-label="Remove service"
                  onClick={() =>
                    onConfigChange((prev) => ({
                      ...prev,
                      services: prev.services.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="sm:col-span-3">
                <Field label="Description">
                  <TextArea
                    rows={2}
                    value={service.description}
                    onChange={(e) =>
                      onConfigChange((prev) => ({
                        ...prev,
                        services: prev.services.map((s, i) =>
                          i === index ? { ...s, description: e.target.value } : s,
                        ),
                      }))
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* About */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader title="About" description="A short story about the agency." />
        <div className="space-y-5 px-6 py-6">
          <Field label="Title" htmlFor="about-title">
            <TextInput
              id="about-title"
              value={config.about.title}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  about: { ...prev.about, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Text" htmlFor="about-text">
            <TextArea
              id="about-text"
              rows={4}
              value={config.about.text}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  about: { ...prev.about, text: e.target.value },
                }))
              }
            />
          </Field>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Portfolio */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader
          title="Portfolio"
          description="Projects loaded from work.json."
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                onWorkChange((prev) => [
                  ...prev,
                  {
                    id: `project-${Date.now()}`,
                    title: 'New project',
                    category: '',
                    description: '',
                    image: '',
                  },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add project
            </Button>
          }
        />
        <div className="space-y-4 px-6 py-6">
          {work.length === 0 && (
            <p className="text-sm text-text/50">No projects yet. Add one to get started.</p>
          )}
          {work.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              onChange={(updated) =>
                onWorkChange((prev) =>
                  prev.map((p, i) => (i === index ? updated : p)),
                )
              }
              onRemove={() =>
                onWorkChange((prev) => prev.filter((_, i) => i !== index))
              }
            />
          ))}
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Contact */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader title="Contact" description="The closing call-to-action section." />
        <div className="space-y-5 px-6 py-6">
          <Field label="Title" htmlFor="contact-title">
            <TextInput
              id="contact-title"
              value={config.contact.title}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, title: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Subtitle" htmlFor="contact-subtitle" hint="Supporting text shown under the title.">
            <TextArea
              id="contact-subtitle"
              rows={2}
              value={config.contact.subtitle}
              onChange={(e) =>
                onConfigChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, subtitle: e.target.value },
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="contact-email">
              <TextInput
                id="contact-email"
                type="email"
                value={config.contact.email}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Button text" htmlFor="contact-button">
              <TextInput
                id="contact-button"
                value={config.contact.buttonText}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, buttonText: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* Legal Pages */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader
          title="Legal Pages"
          description="Edit titles and text for legal pages (Privacy Policy and Terms of Service)."
        />
        <div className="space-y-6 px-6 py-6 border-b border-text/10">
          <h3 className="text-lg font-medium text-text">Privacy Policy</h3>
          <div className="grid grid-cols-1 gap-5">
            <Field label="Privacy Policy Title" htmlFor="privacy-title">
              <TextInput
                id="privacy-title"
                value={config.privacyPolicy?.title ?? 'Privacy Policy'}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    privacyPolicy: {
                      title: e.target.value,
                      text: prev.privacyPolicy?.text ?? '',
                    },
                  }))
                }
              />
            </Field>
            <Field label="Privacy Policy Content" htmlFor="privacy-text" hint="Use newlines to break paragraphs.">
              <TextArea
                id="privacy-text"
                rows={6}
                value={config.privacyPolicy?.text ?? ''}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    privacyPolicy: {
                      title: prev.privacyPolicy?.title ?? 'Privacy Policy',
                      text: e.target.value,
                    },
                  }))
                }
              />
            </Field>
          </div>
        </div>
        <div className="space-y-6 px-6 py-6">
          <h3 className="text-lg font-medium text-text">Terms of Service</h3>
          <div className="grid grid-cols-1 gap-5">
            <Field label="Terms of Service Title" htmlFor="terms-title">
              <TextInput
                id="terms-title"
                value={config.termsOfService?.title ?? 'Terms of Service'}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    termsOfService: {
                      title: e.target.value,
                      text: prev.termsOfService?.text ?? '',
                    },
                  }))
                }
              />
            </Field>
            <Field label="Terms of Service Content" htmlFor="terms-text" hint="Use newlines to break paragraphs.">
              <TextArea
                id="terms-text"
                rows={6}
                value={config.termsOfService?.text ?? ''}
                onChange={(e) =>
                  onConfigChange((prev) => ({
                    ...prev,
                    termsOfService: {
                      title: prev.termsOfService?.title ?? 'Terms of Service',
                      text: e.target.value,
                    },
                  }))
                }
              />
            </Field>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  onChange,
  onRemove,
}: {
  project: Project;
  index: number;
  onChange: (updated: Project) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-text/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-text/50">
          <GripVertical className="h-4 w-4" />
          <span>Project {index + 1}</span>
        </div>
        <Button type="button" variant="danger" aria-label="Remove project" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title">
          <TextInput
            value={project.title}
            onChange={(e) => onChange({ ...project, title: e.target.value })}
          />
        </Field>
        <Field label="Category">
          <TextInput
            value={project.category}
            onChange={(e) => onChange({ ...project, category: e.target.value })}
          />
        </Field>
        <Field label="Image" hint={`Direct image URL preferred. ${IMAGE_HINT}`}>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" />
            <TextInput
              className="pl-9"
              placeholder="https://…"
              value={project.image}
              onChange={(e) => onChange({ ...project, image: e.target.value })}
            />
          </div>
        </Field>
        <Field label="ID" hint="Unique identifier used as the React key.">
          <TextInput
            value={project.id}
            onChange={(e) => onChange({ ...project, id: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <TextArea
              rows={2}
              value={project.description}
              onChange={(e) => onChange({ ...project, description: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
