const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address = 'New York, USA') => {
    if (!address) throw new Error('Address is required');

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw error;
    }
};

module.exports.getDistanceTime = async (origin = 'New York, USA', destination = 'Los Angeles, USA') => {
    if (!origin || !destination) throw new Error('Origin and destination are required');

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to fetch distance and time');
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw error;
    }
};

module.exports.getAutoCompleteSuggestions = async (input = 'New York') => {
    if (!input) throw new Error('Query is required');

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map((item) => ({
                description: item.description,
                place_id: item.place_id,
            }));
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        throw error;
    }
};

module.exports.getCaptainsInTheRadius = async (lat = 40.7128, lng = -74.0060, radius = 10) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lat, lng], radius / 6371], // Earth radius in km
            },
        },
    });

    return captains;
};
