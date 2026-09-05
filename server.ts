import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import ideasRouter from './server/routes/ideas';
import blueprintRouter from './server/routes/blueprint';
import mentorRouter from './server/routes/mentor';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for secure IP resolution behind load balancers / Cloud Run
  app.set('trust proxy', 1);

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Vite HMR and local dev compatibility
  }));
  app.use(cors());
  
  // Body parsing with strict limits to prevent large payload attacks
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Global API Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', apiLimiter);

  // Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount Application API Routes
  app.use('/api/ideas', ideasRouter);
  app.use('/api/projects/:projectId/blueprint', blueprintRouter);
  app.use('/api/projects/:projectId/mentor', mentorRouter);

  // Vite middleware for development (mounts after API routes)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
