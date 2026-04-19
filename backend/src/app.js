import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/AppError.js';
import { env } from './config/env.config.js';

const app = express();

// Global Middlewares
app.use(helmet());
const allowedOrigins = [
  env.CLIENT_URL, 
  'http://localhost:5173', 
  'https://complaint-privacy-system.vercel.app',
  'https://complaint-privacy-system-ksynl11b7.vercel.app'
];
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS', 403));
    }
  }, 
  credentials: true 
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Privacy Complaint System API is running successfully!'
  });
});

app.use('/api/v1', routes);

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
