const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Preserve original filename with timestamp prefix to avoid collisions
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._\-\u3000-\u9fff\uff00-\uffef]/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Get local network IP addresses
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// API: Get server info with QR code
app.get('/api/info', async (req, res) => {
  const ips = getLocalIPs();
  const url = ips.length > 0 ? `http://${ips[0]}:${PORT}` : `http://localhost:${PORT}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
    res.json({ ips, port: PORT, url, qrCode: qrDataUrl });
  } catch (err) {
    res.json({ ips, port: PORT, url, qrCode: null });
  }
});

// API: Upload file
app.post('/api/upload', upload.array('files', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileInfos = req.files.map(f => ({
    id: f.filename,
    originalName: f.originalname,
    size: f.size,
    uploadedAt: new Date().toISOString()
  }));

  // Notify all connected clients
  io.emit('files:added', fileInfos);

  res.json({ files: fileInfos });
});

// API: List files
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map(filename => {
      const filePath = path.join(UPLOAD_DIR, filename);
      const stat = fs.statSync(filePath);
      // Extract original name (remove timestamp prefix)
      const originalName = filename.replace(/^\d+_/, '');
      return {
        id: filename,
        originalName,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString()
      };
    });
    files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.json({ files });
  } catch (err) {
    res.json({ files: [] });
  }
});

// API: Download file
app.get('/api/download/:fileId', (req, res) => {
  const fileId = path.basename(req.params.fileId); // prevent path traversal
  const filePath = path.join(UPLOAD_DIR, fileId);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  const originalName = fileId.replace(/^\d+_/, '');
  res.download(filePath, originalName);
});

// API: Delete file
app.delete('/api/files/:fileId', (req, res) => {
  const fileId = path.basename(req.params.fileId);
  const filePath = path.join(UPLOAD_DIR, fileId);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  fs.unlinkSync(filePath);
  io.emit('files:removed', { id: fileId });
  res.json({ success: true });
});

// Share Target: fallback for when Service Worker doesn't intercept
app.post('/share-target', upload.array('files', 20), (req, res) => {
  if (req.files && req.files.length > 0) {
    const fileInfos = req.files.map(f => ({
      id: f.filename,
      originalName: f.originalname,
      size: f.size,
      uploadedAt: new Date().toISOString()
    }));
    io.emit('files:added', fileInfos);
  }
  res.redirect('/?shared=1');
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Device connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Device disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log('\n========================================');
  console.log('  Cross-Device File Sharing');
  console.log('========================================');
  console.log(`  Local:   http://localhost:${PORT}`);
  ips.forEach(ip => {
    console.log(`  Network: http://${ip}:${PORT}`);
  });
  console.log('----------------------------------------');
  console.log('  Open the URL above on both devices');
  console.log('  (iPhone & Windows PC)');
  console.log('========================================\n');
});
