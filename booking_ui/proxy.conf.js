// Dev only (ng serve). The UI calls its API with relative URLs (config.json api.baseUrl is ""), so the
// dev server forwards those paths to the Django API. Production serves the UI and API from one origin
// through the shared proxy, so this file is not used there.
//
// Browser page loads (Accept: text/html) are never forwarded, so UI routes such as /labs or /me work.
const API_TARGET = process.env.BOOKING_API_URL || 'http://127.0.0.1:8000';

const apiPaths = [
  '/users/',
  '/laboratories/',
  '/public-laboratories/',
  '/equipments/',
  '/timeframes/',
  '/bookings/',
  '/public/',
  '/me/',
  '/reservation/',
];

const proxy = {};
for (const path of apiPaths) {
  proxy[path] = {
    target: API_TARGET,
    secure: false,
    changeOrigin: false,
    bypass: (req) => {
      if (req.headers && req.headers.accept && req.headers.accept.includes('text/html')) {
        return '/index.html';
      }
    },
  };
}

module.exports = proxy;
