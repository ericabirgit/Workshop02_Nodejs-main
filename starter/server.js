const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    try {
        // ========================================
        // TODO: Task 6 (Bonus) - API Endpoint
        // ========================================
        /*
        if (req.url === '/api/time' && req.method === 'GET') {
            const currentDateTime = new Date().toISOString();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                datetime: currentDateTime,
                timestamp: Date.now()
            }));
            return;
        }
        */

        // ========================================
        // TODO: Task 2 - Route Mapping
        // ========================================
        let filePath;

        if (req.url === '/') {
            filePath = path.join(PUBLIC_DIR, 'index.html');

        } else if (req.url === '/index.html') {
            filePath = path.join(PUBLIC_DIR, 'index.html');

        } else if (req.url === '/about') {
            filePath = path.join(PUBLIC_DIR, 'about.html');

        } else if (req.url === '/contact') {
            filePath = path.join(PUBLIC_DIR, 'contact.html');

        // ========================================
        // Task 4 – Serve CSS Files
        // ========================================
        } else if (req.url.startsWith('/styles/')) {
            const cssPath = path.join(PUBLIC_DIR, req.url);
            const normalizedPath = path.normalize(cssPath);

            if (!normalizedPath.startsWith(PUBLIC_DIR)) {
                handle404(res);
                return;
            }

            fs.readFile(normalizedPath, (err, data) => {
                if (err) {
                    handleServerError(res, err);
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            });

            return;

        } else {
            filePath = path.join(PUBLIC_DIR, '404.html');
        }

        // ========================================
        // TODO: Task 3 - Serve Files
        // ========================================
        const extname = path.extname(filePath);
        const contentType = MIME_TYPES[extname] || 'text/html';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    handle404(res);
                } else {
                    handleServerError(res, err);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        handleServerError(res, error);
    }
});

// ========================================
// Task 5 - Error Handling Functions
// ========================================

function handle404(res) {
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');

    fs.readFile(notFoundPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}

function handleServerError(res, error) {
    console.error('Server Error:', error);

    const serverErrorPath = path.join(PUBLIC_DIR, '500.html');

    fs.readFile(serverErrorPath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}

// ========================================
// Task 1 - Start the Server
// ========================================
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
