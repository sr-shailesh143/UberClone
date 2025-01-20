const LocationService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.fetchCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}
module.exports.calculateDistanceAndTime = async (req, res, next) => {
    const inputValidationErrors = validationResult(req);
    if (!inputValidationErrors.isEmpty()) {
        return res.status(400).json({ errors: inputValidationErrors.array(), message: '❌ Invalid input provided!' });
    }

    const { origin = 'New York, USA', destination = 'Los Angeles, USA' } = req.query; // Default values

    try {
        const travelInfo = await LocationService.getDistanceTime(origin, destination);
        res.status(200).json({ travelInfo, message: '🚗 Distance and time calculated successfully!' });
    } catch (error) {
        console.error('Error calculating distance and time:', error.message);
        res.status(500).json({ message: '⚠️ Internal server error. Please try again later!' });
    }
};

module.exports.fetchAutoCompleteSuggestions = async (req, res, next) => {
    const inputValidationErrors = validationResult(req);
    if (!inputValidationErrors.isEmpty()) {
        return res.status(400).json({ errors: inputValidationErrors.array(), message: '❌ Invalid input provided!' });
    }

    const { input = 'New York' } = req.query; // Default input

    try {
        const suggestions = await LocationService.getAutoCompleteSuggestions(input);
        res.status(200).json({ suggestions, message: '🔍 Suggestions retrieved successfully!' });
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        res.status(500).json({ message: '⚠️ Unable to fetch suggestions. Please try again later.' });
    }
};
