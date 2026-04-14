/**
 * Client-side allowlist for who may open the dashboard shell (before API calls).
 * Must match build-time env VITE_ALLOWED_EMAILS (see AUTH_ACCESS.md).
 */

export function parseAllowedEmails(raw) {
  if (raw == null || typeof raw !== 'string') return []
  return raw
    .split(/[,;\n]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function normalizeEmail(email) {
  if (email == null || typeof email !== 'string') return ''
  return email.trim().toLowerCase()
}

export function isEmailAllowed(userEmail, allowedList) {
  const n = normalizeEmail(userEmail)
  if (!n) return false
  return allowedList.includes(n)
}
