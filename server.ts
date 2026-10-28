import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- REST API Endpoints for MITTIVOY Backend ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MITTIVOY Kids Clothing API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Products API
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products retrieved successfully'
  });
});

// Orders API
app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, items, totalAmount, paymentMethod } = req.body;
  const orderNumber = `MT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  res.status(201).json({
    success: true,
    orderNumber,
    message: 'Buyurtma muvaffaqiyatli qabul qilindi'
  });
});

// Payment verification API
app.post('/api/payments/verify', (req, res) => {
  const { orderId, transactionId, status } = req.body;
  res.json({
    success: true,
    orderId,
    transactionId,
    verifiedStatus: status || 'TASDIQLANDI'
  });
});

// POS Offline Sync API
app.post('/api/pos/sync', (req, res) => {
  const { sales } = req.body;
  res.json({
    success: true,
    syncedCount: Array.isArray(sales) ? sales.length : 0,
    conflicts: []
  });
});

// Telegram Bot Webhook
app.post('/api/telegram/webhook', (req, res) => {
  const update = req.body;
  // Handle callback queries for inline approval
  res.json({ ok: true });
});

// --- Production / Dev Serving Setup ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev mode with Vite
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('Vite middleware initialization notice:', e);
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 MITTIVOY Server running at http://0.0.0.0:${PORT}`);
  });
}

// Start if executed directly or in production
if (
  process.env.RUN_STANDALONE === 'true' ||
  process.env.NODE_ENV === 'production' ||
  (process.argv[1] && process.argv[1].includes('server'))
) {
  startServer();
}

export default app;
