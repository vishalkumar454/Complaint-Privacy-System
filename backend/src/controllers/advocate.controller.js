import { Complaint } from '../models/Complaint.model.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getOpenComplaints = catchAsync(async (req, res, next) => {
  // Advocates can browse 'Pending' complaints to pick up
  const complaints = await Complaint.find({ status: 'Pending' })
    .select('-userId') // Anonymize users in marketplace
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: complaints.length,
    data: { complaints }
  });
});

export const acceptComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return next(new AppError('No complaint found with that ID', 404));
  }

  if (complaint.status !== 'Pending') {
    return next(new AppError('This complaint is no longer available', 400));
  }

  complaint.assignedAdvocate = req.user._id;
  complaint.status = 'Accepted';
  await complaint.save();

  res.status(200).json({
    status: 'success',
    data: { complaint }
  });
});

export const getMyCases = catchAsync(async (req, res, next) => {
  const cases = await Complaint.find({ assignedAdvocate: req.user._id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: cases.length,
    data: { cases }
  });
});

export const updateCaseStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const complaint = await Complaint.findOneAndUpdate(
    { _id: req.params.id, assignedAdvocate: req.user._id },
    { status },
    { new: true, runValidators: true }
  );

  if (!complaint) {
    return next(new AppError('No case found or you are not authorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { complaint }
  });
});
