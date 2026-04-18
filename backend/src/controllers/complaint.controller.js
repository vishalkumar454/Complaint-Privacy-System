import { Complaint } from '../models/Complaint.model.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createComplaint = catchAsync(async (req, res, next) => {
  const { title, description, category, isAnonymous } = req.body;

  const complaintData = {
    title,
    description,
    category,
    isAnonymous
  };

  if (!isAnonymous && !req.user) {
    return next(new AppError('You must be logged in to submit a non-anonymous complaint', 401));
  }

  // Always link the complaint to the user if they are logged in, 
  // so they can track it on their dashboard.
  if (req.user) {
    complaintData.userId = req.user._id;
  }

  const newComplaint = await Complaint.create(complaintData);

  res.status(201).json({
    status: 'success',
    data: {
      complaint: newComplaint
    }
  });
});

export const getUserComplaints = catchAsync(async (req, res, next) => {
  const complaints = await Complaint.find({ userId: req.user._id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: complaints.length,
    data: { complaints }
  });
});

export const getComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('assignedAdvocate', 'name email specialization isVerified')
    .populate('userId', 'name email');

  if (!complaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  const getSafeId = (obj) => obj ? (obj._id ? obj._id.toString() : obj.toString()) : null;
  
  // Security check: Only author or assigned advocate or admin can view
  const isOwner = getSafeId(complaint.userId) === req.user._id.toString();
  const isAssignedAdvocate = getSafeId(complaint.assignedAdvocate) === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAssignedAdvocate && !isAdmin) {
    return next(new AppError('You do not have permission to view this complaint', 403));
  }

  // Strip user details if anonymous and requester is not the owner
  const complaintObj = complaint.toObject();
  if (complaintObj.isAnonymous && !isOwner) {
    complaintObj.userId = null;
  }

  res.status(200).json({
    status: 'success',
    data: { complaint: complaintObj }
  });
});
