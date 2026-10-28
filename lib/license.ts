import { jwtVerify, SignJWT } from 'jose';

// These are hardcoded — they never change for this product
const LICENSE_SERVER_URL = 'https://license-server-phi-eight.vercel.app';
const LICENSE_PRODUCT = 'agency-lite';
const LICENSE_SERVER_SECRET = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p7';

// Only theseone come from env (set by client after purchase)
const LICENSE_KEY = process.env.LICENSE_KEY || '';

export const LICENSE_COOKIE_NAME = 'agency_lite_license';

// Admin session cookie — set after a valid license key is provided at /admin
export const ADMIN_SESSION_COOKIE_NAME = 'admin_session';
// 7 days in seconds
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getLicenseSecret() {
  return new TextEncoder().encode(
    LICENSE_SERVER_SECRET || 'fallback_dev_secret'
  );
}

// Verify JWT locally — no network call, works in Edge Runtime
export async function verifyLicenseToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getLicenseSecret());
    return payload.valid === true;
  } catch {
    return false;
  }
}

// Keep instant deployment one-variable-only: grace tokens use the same bundled
// verification secret as normal license JWTs, so buyers still configure only
// LICENSE_KEY. The token is signed and expires automatically after six hours.
export async function createGraceToken(hours = 6): Promise<string> {
  return new SignJWT({ grace: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${hours}h`)
    .sign(getLicenseSecret());
}

export async function verifyGraceToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getLicenseSecret());
    return payload.grace === true;
  } catch {
    return false;
  }
}

type LicenseValidation = {
  valid: boolean;
  token?: string;
  grace?: boolean;
  product?: string;
};

// Fetch fresh validation from license server
export async function fetchLicenseValidation(): Promise<LicenseValidation> {
  // No key configured = license required
  if (!LICENSE_KEY || !LICENSE_SERVER_URL) {
    return { valid: false };
  }

  try {
    const response = await fetch(`${LICENSE_SERVER_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: LICENSE_KEY,
        product: LICENSE_PRODUCT
      }),
      // A slow license server must not stall page loads: on timeout the
      // visitor gets a grace cookie and the site keeps working.
      signal: AbortSignal.timeout(3000),
    });

    // A technical server outage should not disable a paid deployment. Invalid,
    // revoked and malformed licenses return 4xx and remain fail-closed.
    if (response.status >= 500) {
      return { valid: true, grace: true };
    }

    const data = await response.json();

    // Verify returned product matches what this project expects
    if (data.valid && data.product && data.product !== LICENSE_PRODUCT) {
      return { valid: false };
    }

    return data;
  } catch {
    // Server unreachable — grant grace period
    return { valid: true, grace: true };
  }
}

// Per-instance memo of the last license server answer. Visitors without a
// license cookie (first visits, crawlers, link previews) would otherwise each
// wait for their own round trip. Purely an optimization: a recycled instance
// just asks the server again.
const VALID_CACHE_MS = 60 * 60 * 1000;
const GRACE_CACHE_MS = 5 * 60 * 1000;
const INVALID_CACHE_MS = 60 * 1000;

let cachedValidation: { result: LicenseValidation; expiresAt: number } | null = null;
let pendingValidation: Promise<LicenseValidation> | null = null;

export async function getLicenseValidation(): Promise<LicenseValidation> {
  if (cachedValidation && cachedValidation.expiresAt > Date.now()) {
    return cachedValidation.result;
  }

  if (!pendingValidation) {
    pendingValidation = fetchLicenseValidation()
      .then((result) => {
        const ttl = !result.valid
          ? INVALID_CACHE_MS
          : result.token
            ? VALID_CACHE_MS
            : GRACE_CACHE_MS;
        cachedValidation = { result, expiresAt: Date.now() + ttl };
        return result;
      })
      .finally(() => {
        pendingValidation = null;
      });
  }
  return pendingValidation;
}

// Secret used to sign/verify the admin session JWT.
// Falls back to the license server secret so no extra env var is strictly required.
export function getAdminSecret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || LICENSE_SERVER_SECRET || 'fallback_dev_secret'
  );
}

// Validate a license key entered by an admin at /admin.
// Most reliable: compare against the system-configured process.env.LICENSE_KEY.
// Otherwise, validate the provided key directly against the license server.
export async function validateLicenseKey(key: string): Promise<boolean> {
  if (!key) return false;

  const systemKey = process.env.LICENSE_KEY;
  if (systemKey) {
    return key === systemKey;
  }

  // No system key configured — validate the entered key against the license server
  try {
    const response = await fetch(`${LICENSE_SERVER_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, product: LICENSE_PRODUCT }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    return data.valid === true && (!data.product || data.product === LICENSE_PRODUCT);
  } catch {
    return false;
  }
}

// Sign a short-lived admin session JWT (valid for 7 days).
export async function signAdminSession(): Promise<string> {
  return await new SignJWT({ admin: true, valid: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
    .sign(getAdminSecret());
}

// Verify an admin session JWT locally — no network call.
export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getAdminSecret());
    return payload.admin === true;
  } catch {
    return false;
  }
}
