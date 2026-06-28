'use client';

import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Database, ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Info, ZoomIn, X } from 'lucide-react';
import {
  type GitHubSettings,
  saveGitHubSettings,
} from '@/lib/github';
import { Button, Card, CardHeader, Field, TextInput } from './ui';

interface Props {
  initial?: GitHubSettings | null;
  onSaved: (settings: GitHubSettings) => void;
  onBack?: () => void;
}

export default function GitHubSetup({ initial, onSaved, onBack }: Props) {
  const [pat, setPat] = useState(initial?.pat ?? '');
  const [repo, setRepo] = useState(initial?.repo ?? '');
  const [branch, setBranch] = useState(initial?.branch ?? 'main');
  const [showPat, setShowPat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accordion open/close states
  const [showPatInstructions, setShowPatInstructions] = useState(false);
  const [showRepoInstructions, setShowRepoInstructions] = useState(false);

  // Fullscreen image modal state
  const [showImageModal, setShowImageModal] = useState(false);

  // Intelligent Repository Link Parser
  function handleRepoChange(value: string) {
    let clean = value.trim();

    // Remove https://github.com/ or http://github.com/ or github.com/
    clean = clean.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '');
    // Remove SSH prefix git@github.com:
    clean = clean.replace(/^git@github\.com:/i, '');
    // Remove .git ending
    clean = clean.replace(/\.git$/i, '');
    // Remove any leading/trailing slashes
    clean = clean.replace(/^\/+|\/+$/g, '');

    setRepo(clean);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedRepo = repo.trim();
    if (!pat.trim()) {
      setError('A GitHub personal access token is required.');
      return;
    }
    if (!/^[^/]+\/[^/]+$/.test(trimmedRepo)) {
      setError('Repository must be in the format "owner/name" (e.g. acme/agency-site).');
      return;
    }

    const settings: GitHubSettings = {
      pat: pat.trim(),
      repo: trimmedRepo,
      branch: branch.trim() || 'main',
    };
    saveGitHubSettings(settings);
    onSaved(settings);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader
          icon={<Database className="h-5 w-5" />}
          title="Connect your GitHub repository"
          description="Your content is stored as JSON in this repo. Settings are saved only in this browser."
        />
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">

          {/* ----------------- PERSONAL ACCESS TOKEN (PAT) ----------------- */}
          <Field
            label="Personal access token"
            htmlFor="github_pat"
          >
            <div className="relative mb-2">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" />
              <TextInput
                id="github_pat"
                name="github_pat"
                type={showPat ? 'text' : 'password'}
                autoComplete="off"
                spellCheck={false}
                required
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="github_pat_…"
                className="pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPat((v) => !v)}
                aria-label={showPat ? 'Hide token' : 'Show token'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-text/50 hover:text-text"
              >
                {showPat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Quickstart & Step-by-Step Instructions */}
            <div className="rounded-lg bg-text/5 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href="https://github.com/settings/personal-access-tokens/new?name=OWY-CMS-Token&description=Token%20for%20OwnYourWebsite%20CMS&scopes=public_repo&permissions[contents]=write"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Generate token on GitHub
                </a>
                <button
                  type="button"
                  onClick={() => setShowPatInstructions((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs text-text/60 hover:text-text"
                >
                  <span>How to configure?</span>
                  {showPatInstructions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* Collapsible Spoiler with instructions */}
              {showPatInstructions && (
                <div className="mt-3 border-t border-text/10 pt-3 text-xs text-text/70 space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium text-text">Follow these steps on GitHub:</p>
                    <ul className="list-inside list-disc space-y-1 pl-1">
                      <li><span className="font-semibold text-text">Name & Description:</span> Prefilled automatically.</li>
                      <li><span className="font-semibold text-text">Expiration:</span> Set to <span className="font-medium text-text">No expiration</span> for continuous access.</li>
                      <li><span className="font-semibold text-text">Repository access:</span> Select your repository (e.g. choose <span className="font-medium text-text">Only select repositories</span> and select your repo).</li>
                      <li>
                        <span className="font-semibold text-text">Permissions:</span>
                        <ol className="mt-1 list-inside list-decimal pl-3 space-y-1">
                          <li>Expand the <span className="font-medium text-text">Repository permissions</span> section.</li>
                          <li>Find <span className="font-medium text-text">Contents</span> in the list.</li>
                          <li>Change Access to <span className="font-semibold text-accent">Read and write</span> (defaults to read-only when checked).</li>
                        </ol>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-2 rounded bg-accent/10 p-2 text-accent">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>GitHub will automatically add other basic required scopes (such as Metadata) — this is expected and safe.</span>
                  </div>

                  {/* Thumbnail and button to trigger full screen preview */}
                  <div className="space-y-1.5 pt-1">
                    <p className="font-medium text-text">Visual Guide / Reference Screenshot:</p>
                    <button
                      type="button"
                      onClick={() => setShowImageModal(true)}
                      className="group relative block w-full overflow-hidden rounded-lg border border-text/10 bg-black/40 text-left transition-all hover:border-text/25"
                    >
                      <img
                        src="https://i.imgur.com/5GNUykI.jpeg"
                        alt="GitHub Fine-Grained Token configuration screenshot guide"
                        className="h-24 w-full object-cover opacity-60 transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg shadow-sm">
                          <ZoomIn className="h-3 w-3" />
                          Zoom / View Fullscreen
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Field>

          {/* ----------------- REPOSITORY ----------------- */}
          <Field
            label="Repository"
            htmlFor="github_repo"
          >
            <TextInput
              id="github_repo"
              name="github_repo"
              type="text"
              autoComplete="off"
              spellCheck={false}
              required
              value={repo}
              onChange={(e) => handleRepoChange(e.target.value)}
              placeholder="owner/name (e.g. acme/agency-site)"
              className="mb-2"
            />

            {/* Quickstart Repository Box */}
            <div className="rounded-lg bg-text/5 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href="https://github.com/settings/repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  My GitHub Repositories
                </a>
                <button
                  type="button"
                  onClick={() => setShowRepoInstructions((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs text-text/60 hover:text-text"
                >
                  <span>Need help?</span>
                  {showRepoInstructions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* Spoiler for Repository */}
              {showRepoInstructions && (
                <div className="mt-3 border-t border-text/10 pt-3 text-xs text-text/70 space-y-2">
                  <p>
                    Simply copy and paste the full repository link from your browser's address bar.
                  </p>
                  <p className="text-accent font-medium">
                    ✨ The input automatically parses and sanitizes it!
                  </p>
                  <p className="text-text/50">
                    For example, pasting <code className="bg-text/10 px-1 rounded text-text">https://github.com/acme/agency-site</code> automatically cleans up to <code className="font-semibold text-text">acme/agency-site</code>.
                  </p>
                </div>
              )}
            </div>
          </Field>

          {/* ----------------- BRANCH ----------------- */}
          <Field label="Branch" htmlFor="github_branch" hint="Default branch is main. Recommended to leave as is.">
            <TextInput
              id="github_branch"
              name="github_branch"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
            />
          </Field>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            {onBack ? (
              <Button type="button" variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={!pat.trim() || !repo.trim()}>
              Connect & load content
            </Button>
          </div>
        </form>
      </Card>

      {/* ----------------- FULLSCREEN IMAGE MODAL ----------------- */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-h-full max-w-5xl overflow-hidden rounded-xl bg-[#0b101f] shadow-2xl border border-text/10">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-text/10 bg-black/40 px-4 py-3">
              <span className="text-xs font-semibold text-text/80">GitHub Token Permissions Guide</span>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="rounded-lg p-1 text-text/60 hover:bg-text/10 hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Image container */}
            <div className="p-2 overflow-auto max-h-[80vh] flex justify-center">
              <img
                src="https://i.imgur.com/5GNUykI.jpeg"
                alt="GitHub Fine-Grained Token configuration screenshot guide"
                className="max-w-full h-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
