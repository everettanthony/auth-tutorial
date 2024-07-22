/**
 * An array of routes that are accesible to the public
 */
export const publicRoutes = [
    '/',
    '/auth/new-verification'
];

/**
 * An array of routes that are used for authentication
 * These routes will recirect the logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset',
    '/auth/new-password'
];

/**
 * The prefix for API authentication routes
 * Routes starting with this prefix are used for API
 * authentication purposes
 * @type {string[]}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after user logs in
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';