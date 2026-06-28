'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Database,
  LogOut,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  type Config,
  type GitHubSettings,
  type Work,
  clearGitHubSettings,
  fetchJsonFile,
  loadGitHubSettings,
  updateJsonFile,
} from '@/lib/github';
import GitHubSetup from './GitHubSetup';
import ContentEditor from './ContentEditor';
import { Button, Card, StatusBanner, type SaveStatus } from './ui';

const CONFIG_PATH = 'content/config.json';
const WORK_PATH = 'content/work.json';

type LoadState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string };

export default function AdminPanel() {
  const router = useRouter();

  const [settings, setSettings] = useState<GitHubSettings | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const [config, setConfig] = useState<Config | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [configSha, setConfigSha] = useState<string>('');
  const [workSha, setWorkSha] = useState<string>('');

  const [loadState, setLoadState] = useState<LoadState>({ kind: 'idle' });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ kind: 'idle' });
  const [loggingOut, setLoggingOut] = useState(false);

  // -------------------------------------------------------------------------
  // Hydrate settings from localStorage on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    const stored = loadGitHubSettings();
    const timer = setTimeout(() => {
      setSettings(stored);
      setShowSetup(!stored);
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // -------------------------------------------------------------------------
  // Load content whenever settings become available
  // -------------------------------------------------------------------------
  const loadContent = useCallback(async (s: GitHubSettings) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    setLoadState({ kind: 'loading' });
    setSaveStatus({ kind: 'idle' });
    try {
      const [configFile, workFile] = await Promise.all([
        fetchJsonFile<Config>(s, CONFIG_PATH),
        fetchJsonFile<Work>(s, WORK_PATH),
      ]);
      setConfig(configFile.data);
      setConfigSha(configFile.sha);
      setWork(workFile.data);
      setWorkSha(workFile.sha);
      setLoadState({ kind: 'idle' });
    } catch (err) {
      setLoadState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Failed to load content.',
      });
    }
  }, []);

  useEffect(() => {
    if (settings && !config && !work && loadState.kind !== 'loading') {
      const timer = setTimeout(() => {
        void loadContent(settings);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [settings, config, work, loadState.kind, loadContent]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  function handleSettingsSaved(next: GitHubSettings) {
    setSettings(next);
    setShowSetup(false);
    // Reset any previously loaded content so it reloads from the new repo.
    setConfig(null);
    setWork(null);
    setConfigSha('');
    setWorkSha('');
    void loadContent(next);
  }

  function handleDisconnect() {
    clearGitHubSettings();
    setSettings(null);
    setConfig(null);
    setWork(null);
    setConfigSha('');
    setWorkSha('');
    setLoadState({ kind: 'idle' });
    setSaveStatus({ kind: 'idle' });
    setShowSetup(true);
  }

  async function handleSave() {
    if (!settings || !config || !work) return;
    setSaveStatus({ kind: 'loading', message: 'Saving…' });
    try {
      // Save config.json if it changed.
      const configResult = await updateJsonFile(
        settings,
        CONFIG_PATH,
        config,
        configSha,
        'chore(content): update site config via admin panel',
      );
      setConfigSha(configResult.sha);

      // Save work.json if it changed.
      const workResult = await updateJsonFile(
        settings,
        WORK_PATH,
        work,
        workSha,
        'chore(content): update portfolio via admin panel',
      );
      setWorkSha(workResult.sha);

      setSaveStatus({
        kind: 'success',
        message:
          'Success! Changes committed. Vercel is redeploying your site.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save changes.';
      setSaveStatus({ kind: 'error', message });
      // On a sha conflict, reload so the editor reflects the remote state.
      if (message.toLowerCase().includes('conflict')) {
        void loadContent(settings);
      }
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render guards
  // -------------------------------------------------------------------------
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text">
        <RefreshCw className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  const repoUrl = settings
    ? `https://github.com/${settings.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '')}`
    : null;

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ----------------------------------------------------------------- */}
      {/* Top bar */}
      {/* ----------------------------------------------------------------- */}
      <header className="sticky top-0 z-20 border-b border-text/10 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold tracking-tight">Agency Lite · CMS</span>
          </div>
          <div className="flex items-center gap-2">
            {settings && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowSetup(true)}
                title="GitHub settings"
              >
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={handleLogout}
              disabled={loggingOut}
              loading={loggingOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{loggingOut ? 'Signing out…' : 'Logout'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* --------------------------------------------------------------- */}
        {/* Setup form */}
        {/* --------------------------------------------------------------- */}
        {showSetup || !settings ? (
          <GitHubSetup
            initial={settings}
            onSaved={handleSettingsSaved}
            onBack={settings ? () => setShowSetup(false) : undefined}
          />
        ) : (
          <>
            {/* ----------------------------------------------------------- */}
            {/* Repo summary */}
            {/* ----------------------------------------------------------- */}
            <Card className="mb-6">
              <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-text">{settings.repo}</p>
                    <p className="text-xs text-text/50">
                      branch: {settings.branch}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {repoUrl && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-text/70 transition-colors hover:bg-text/5 hover:text-text"
                    >
                      View repo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => loadContent(settings)}
                    disabled={loadState.kind === 'loading'}
                    loading={loadState.kind === 'loading'}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </div>
            </Card>

            {/* ----------------------------------------------------------- */}
            {/* Load error */}
            {/* ----------------------------------------------------------- */}
            {loadState.kind === 'error' && (
              <Card className="mb-6 border-red-400/40">
                <div className="flex flex-col gap-3 px-6 py-5">
                  <p className="text-sm font-medium text-red-400">
                    Couldn’t load content
                  </p>
                  <p className="text-sm text-text/70">{loadState.message}</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => loadContent(settings)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try again
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowSetup(true)}>
                      Edit settings
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* ----------------------------------------------------------- */}
            {/* Loading skeleton */}
            {/* ----------------------------------------------------------- */}
            {loadState.kind === 'loading' && !config && (
              <div className="flex items-center justify-center py-24 text-text/50">
                <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                Loading content from GitHub…
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* Editor */}
            {/* ----------------------------------------------------------- */}
            {config && work && (
              <>
                <ContentEditor
                  config={config}
                  work={work}
                  onConfigChange={(updater) =>
                    setConfig((prev) => (prev ? updater(prev) : prev))
                  }
                  onWorkChange={(updater) =>
                    setWork((prev) => (prev ? updater(prev) : prev))
                  }
                />

                <div className="sticky bottom-4 mt-8">
                  <Card className="border-text/15 shadow-lg">
                    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <StatusBanner status={saveStatus} />
                        {saveStatus.kind === 'idle' && (
                          <p className="text-xs text-text/45">
                            Changes commit directly to {settings.repo} on the{' '}
                            {settings.branch} branch.
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handleSave}
                        disabled={saveStatus.kind === 'loading'}
                        loading={saveStatus.kind === 'loading'}
                        className="sm:shrink-0"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
