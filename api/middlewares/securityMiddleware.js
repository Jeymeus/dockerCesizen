// api/middlewares/securityMiddleware.js
export const securityHeaders = (req, res, next) => {
    // Masquer X-Powered-By (Express leak)
    res.removeHeader('X-Powered-By');

    // Content Security Policy pour API
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';");

    // Headers anti-clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Protection MIME
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Permissions Policy
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()');

    // CORS sécurisé - remplace le CORS basique
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        `http://${process.env.FRONTEND_HOST || 'localhost'}:5173`,
        process.env.FRONTEND_URL
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24h

    // Cache control pour sécurité
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Protection XSS
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};

// Middleware pour gérer robots.txt et sitemap.xml
export const handleRobotsSitemap = (req, res, next) => {
    if (req.path === '/robots.txt') {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        return res.status(200).send('User-agent: *\nDisallow: /\n');
    }

    if (req.path === '/sitemap.xml') {
        // Pour une API, on bloque l'accès au sitemap
        return res.status(404).json({ error: 'Not Found' });
    }

    next();
};

// Middleware CORS sécurisé
export const securedCors = (req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
        process.env.VITE_API_URL?.replace('/api', '')
    ].filter(Boolean);

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24h

    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
};