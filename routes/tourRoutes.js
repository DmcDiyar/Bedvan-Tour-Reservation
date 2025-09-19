const express = require('express');
const tourController = require('./../controllers/tourController');
const tourFeaturesController = require('./../controllers/tourFeaturesController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// TOP 5 CHEAP TOURS
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan
);

// AI Assistant endpoint
router.route('/ai-query').post(tourFeaturesController.aiQuery);

// Search and filter routes
router.route('/search').get(tourFeaturesController.searchTours);
router.route('/filter').get(tourFeaturesController.filterTours);
router.route('/difficulty/:difficulty').get(tourFeaturesController.getToursByDifficulty);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourFeaturesController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourFeaturesController.getDistances);

router
  .route('/')
  .get(tourFeaturesController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// Nested route for reviews
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;