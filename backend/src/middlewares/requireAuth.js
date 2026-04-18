import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../models/User.model.js';
import { Advocate } from '../models/Advocate.model.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { env } from '../config/env.config.js';

export const requireAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, env.JWT_SECRET);
  
  // Try finding user or advocate
  let currentUser = await User.findById(decoded.id);
  let userType = currentUser ? currentUser.role : null; // 'user' or 'admin'
  
  if (!currentUser) {
    currentUser = await Advocate.findById(decoded.id);
    userType = 'advocate';
  }

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  req.user = currentUser;
  req.userType = userType;
  next();
});

export const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = await promisify(jwt.verify)(token, env.JWT_SECRET);
    
    let currentUser = await User.findById(decoded.id);
    let userType = currentUser ? currentUser.role : null;
    
    if (!currentUser) {
      currentUser = await Advocate.findById(decoded.id);
      userType = 'advocate';
    }

    if (currentUser) {
      req.user = currentUser;
      req.userType = userType;
    }
  } catch (error) {
    // If token verification fails, just ignore and treat as anonymous
    console.warn("Optional auth token verification failed:", error.message);
  }

  next();
});
