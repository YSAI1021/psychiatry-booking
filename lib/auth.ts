/**
 * Admin authentication utilities
 * Uses environment variables for admin credentials
 */

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

/**
 * Verify admin credentials
 * @param email - Admin email
 * @param password - Admin password
 * @returns boolean indicating if credentials are valid
 */
export function verifyAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

/**
 * Check if user is admin (based on localStorage)
 * @returns boolean indicating if user is admin
 */
export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('admin_session') === 'true'
}

/**
 * Set admin session
 * @param value - Session value
 */
export function setAdminSession(value: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_session', value.toString())
}

/**
 * Clear admin session
 */
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('admin_session')
}


