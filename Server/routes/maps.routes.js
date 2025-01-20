const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');

router.get('/get-coordinates',
    query('address').optional().isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.fetchCoordinates
);

router.get('/get-distance-time',
    query('origin').optional().isString().isLength({ min: 3 }),
    query('destination').optional().isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.calculateDistanceAndTime
);

router.get('/get-suggestions',
    query('input').optional().isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.fetchAutoCompleteSuggestions
);

module.exports = router;
