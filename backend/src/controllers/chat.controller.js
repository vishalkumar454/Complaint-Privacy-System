import { Message } from '../models/Message.model.js';
import { Complaint } from '../models/Complaint.model.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getMessagesForComplaint = catchAsync(async (req, res, next) => {
  const { complaintId } = req.params;

  // Verify access
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    return next(new AppError('Complaint not found', 404));
  }

  console.log("Complaint userId:", complaint.userId);
  console.log("Complaint advocate:", complaint.assignedAdvocate);
  console.log("Logged user:", req.user);
  console.log("Logged user id:", req.user?._id);

  const getSafeId = (obj) => obj ? (obj._id ? obj._id.toString() : obj.toString()) : null;

  const isOwner = getSafeId(complaint.userId) === req.user._id.toString();
  const isAssignedAdvocate = getSafeId(complaint.assignedAdvocate) === req.user._id.toString();

  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAssignedAdvocate && !isAdmin) {
    return next(new AppError('Not authorized to view these messages', 403));
  }

  const messages = await Message.find({ complaintId }).sort('createdAt');

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: { messages }
  });
});

export const sendMessage = catchAsync(async (req, res, next) => {
  const { complaintId } = req.params;
  const { content } = req.body;

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    return next(new AppError('Complaint not found', 404));
  }

  const getSafeId = (obj) => obj ? (obj._id ? obj._id.toString() : obj.toString()) : null;

  const isOwner = getSafeId(complaint.userId) === req.user._id.toString();
  const isAssignedAdvocate = getSafeId(complaint.assignedAdvocate) === req.user._id.toString();

  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAssignedAdvocate && !isAdmin) {
    return next(new AppError('Not authorized to send messages here', 403));
  }

  const senderModel = req.userType === 'advocate' ? 'Advocate' : 'User';

  const newMessage = await Message.create({
    complaintId,
    senderId: req.user._id,
    senderModel,
    content
  });

  res.status(201).json({
    status: 'success',
    data: { message: newMessage }
  });

});
