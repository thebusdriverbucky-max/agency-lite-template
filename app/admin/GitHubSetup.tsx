'use client';

import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Database, ArrowLeft } from 'lucide-react';
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedRepo = repo.trim();
    if (!pat.trim()) {
      setError('A GitHub personal access token is required.');
      return;
    }
    if (!/^[^/]+\/[^/]+$/.test(trimmedRepo)) {
      setError('Repository must be in the format "owner/name".');
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
          <Field
            label="Personal access token"
            htmlFor="github_pat"
            hint="Create a fine-grained token with Contents read & write access. Stored locally only."
          >
            <div className="relative">
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
          </Field>

          <Field label="Repository" htmlFor="github_repo" hint="owner/name, e.g. acme/agency-site">
            <TextInput
              id="github_repo"
              name="github_repo"
              type="text"
              autoComplete="off"
              spellCheck={false}
              required
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="owner/name"
            />
          </Field>

          <Field label="Branch" htmlFor="github_branch" hint="Defaults to main.">
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
    </div>
  );
}
