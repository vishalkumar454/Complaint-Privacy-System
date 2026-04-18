import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { Advocate } from '../models/Advocate.model.js';
import { Complaint } from '../models/Complaint.model.js';

export const getUnverifiedAdvocates = catchAsync(async (req, res, next) => {
  const advocates = await Advocate.find({ isVerified: false });

  res.status(200).json({
    status: 'success',
    results: advocates.length,
    data: { advocates }
  });
});

export const verifyAdvocate = catchAsync(async (req, res, next) => {
  const advocate = await Advocate.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true, runValidators: true }
  );

  if (!advocate) {
    return next(new AppError('No advocate found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { advocate }
  });
});

export const getSystemStats = catchAsync(async (req, res, next) => {
  const totalComplaints = await Complaint.countDocuments();
  const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
  const totalAdvocates = await Advocate.countDocuments({ isVerified: true });
  
  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalComplaints,
        resolvedComplaints,
        totalAdvocates
      }
    }
  });
});

export const getVerifiedAdvocates = catchAsync(async (req, res, next) => {
  const advocates = await Advocate.find({ isVerified: true }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: advocates.length,
    data: { advocates }
  });
});

export const getAllComplaints = catchAsync(async (req, res, next) => {
  const complaints = await Complaint.find()
    .populate('assignedAdvocate', 'name')
    .populate('userId', 'name')
    .sort('-createdDate');

  res.status(200).json({
    status: 'success',
    results: complaints.length,
    data: { complaints }
  });
});
