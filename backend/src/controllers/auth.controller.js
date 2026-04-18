import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { Advocate } from '../models/Advocate.model.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { env } from '../config/env.config.js';

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res, isAdvocate = false) => {
  const token = signToken(user._id);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
      type: isAdvocate ? 'advocate' : (user.role || 'user')
    }
  });
};

export const registerUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  createSendToken(newUser, 201, res);
});

export const registerAdvocate = catchAsync(async (req, res, next) => {
  const newAdvocate = await Advocate.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    specialization: req.body.specialization,
    barCouncilId: req.body.barCouncilId
  });

  createSendToken(newAdvocate, 201, res, true);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password, type } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  let user;
  let isAdvocate = false;

  if (type === 'advocate') {
    user = await Advocate.findOne({ email }).select('+password');
    isAdvocate = true;
  } else {
    user = await User.findOne({ email }).select('+password');
  }

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (isAdvocate && !user.isVerified) {
    return next(new AppError('Your advocate account is pending verification by admin', 403));
  }

  createSendToken(user, 200, res, isAdvocate);
});

export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
      type: req.userType
    }
  });
});
