'use client';

import { type ReactNode } from 'react';
import { Loader } from 'lucide-react';

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-text/10 bg-bg/60 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-text/10 px-6 py-5">
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 text-accent">{icon}</span>}
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-text">{title}</h2>
          {description && <p className="mt-1 text-sm text-text/60">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field + inputs
// ---------------------------------------------------------------------------

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-text/80">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-text/45">{hint}</p>}
    </div>
  );
}

const inputBase =
  'w-full rounded-lg border border-text/15 bg-text/5 px-3 py-2 text-sm text-text placeholder:text-text/35 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60';

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className = '', ...rest } = props;
  return <input className={`${inputBase} ${className}`} {...rest} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className = '', rows = 3, ...rest } = props;
  return (
    <textarea rows={rows} className={`${inputBase} resize-y ${className}`} {...rest} />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { className = '', children, ...rest } = props;
  return (
    <select className={`${inputBase} cursor-pointer ${className}`} {...rest}>
      {children}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-bg hover:opacity-90 focus-visible:ring-accent',
  secondary:
    'border border-text/15 text-text hover:bg-text/5 focus-visible:ring-text/30',
  ghost: 'text-text/70 hover:text-text hover:bg-text/5 focus-visible:ring-text/30',
  danger:
    'border border-red-400/40 text-red-400 hover:bg-red-400/10 focus-visible:ring-red-400/40',
};

export function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
}) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && <Loader className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Status banner
// ---------------------------------------------------------------------------

export type SaveStatus =
  | { kind: 'idle' }
  | { kind: 'loading'; message: string }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export function StatusBanner({ status }: { status: SaveStatus }) {
  if (status.kind === 'idle') return null;

  const styles = {
    loading: 'border-text/15 bg-text/5 text-text/80',
    success: 'border-accent/40 bg-accent/10 text-text',
    error: 'border-red-400/40 bg-red-400/10 text-red-400',
  }[status.kind];

  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {status.kind === 'loading' && <Loader className="h-4 w-4 shrink-0 animate-spin" />}
      <span>{status.message}</span>
    </div>
  );
}
