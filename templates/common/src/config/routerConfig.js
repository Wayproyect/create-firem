/**
 * Configure the rendering route structure for the application.
 * - 'browser': Standard HTML5 history routing. Requires hosting server redirects (rewrite to index.html).
 * - 'hash': Hash-based routing (#/path). Works on any hosting setup out-of-the-box (zero-config).
 */
export const ROUTER_MODE = 'browser'; // 'browser' | 'hash'
