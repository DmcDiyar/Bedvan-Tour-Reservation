const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIResponse = require('./../utils/apiResponse');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// Do NOT update password on this
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json(
    APIResponse.success(
      {
        data: review
      },
      'Review updated successfully',
      200
    )
  );
});

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  
  res.status(200).json(
    APIResponse.success(
      {
        results: reviews.length,
        data: reviews
      },
      'User reviews retrieved successfully',
      200
    )
  );
});

exports.updateMyReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!review) {
    return next(new AppError('No review found with that ID or you do not have permission to edit it', 404));
  }

  res.status(200).json(
    APIResponse.success(
      {
        data: review
      },
      'Review updated successfully',
      200
    )
  );
});

exports.deleteMyReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!review) {
    return next(new AppError('No review found with that ID or you do not have permission to delete it', 404));
  }

  res.status(204).json(
    APIResponse.success(
      null,
      'Review deleted successfully',
      204
    )
  );
});