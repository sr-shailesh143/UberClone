const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const MapsService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideService = require('../services/ride.service');
const Ride = require('../models/ride.model'); 


module.exports.initiateRide = async (req, res) => {
    try {
        const { otp, fare, user, pickup, destination } = req.body;

        const rideData = {
            otp: otp || Math.floor(100000 + Math.random() * 900000), 
            fare: fare || 50,
            user: user?._id || new mongoose.Types.ObjectId(), 
            pickup: pickup || 'ctm',
            destination: destination || 'vastral',
            status: 'pending', 
        };

        const newRide = new Ride(rideData);
        await newRide.save();

        res.status(201).json({
            message: 'Ride initiated successfully',
            ride: newRide,
        });
    } catch (error) {
        console.error('Error initiating ride:', error);
        res.status(500).json({
            message: 'Error initiating ride',
            error: error.message,
        });
    }
};


module.exports.calculateFare = async (req, res) => {
    const validationIssues = validationResult(req);
    if (!validationIssues.isEmpty()) {
        return res.status(400).json({ errors: validationIssues.array(), message: 'Validation errors!' });
    }

    const { pickup, destination } = req.query;

    if (!pickup || !destination) {
        return res.status(400).json({ message: 'Pickup and destination are required!' });
    }

    try {
        const estimatedFare = await rideService.calculateFare(pickup, destination);
        return res.status(200).json({ fare: estimatedFare, message: 'Fare estimate retrieved successfully!' });
    } catch (error) {
        console.error('Error calculating fare:', error);
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


module.exports.acceptRide = async (req, res) => {
    const validationIssues = validationResult(req);
    if (!validationIssues.isEmpty()) {
        return res.status(400).json({ errors: validationIssues.array(), message: 'Validation errors!' });
    }

    const { rideId } = req.body;

    if (!rideId) {
        return res.status(400).json({ message: 'Ride ID is required!' });
    }

    try {
        const confirmedRide = await rideService.confirmRide({ rideId, captain: req.driver });

        sendMessageToSocketId(confirmedRide.passenger.socketId, {
            event: 'ride-confirmed',
            data: confirmedRide,
        });

        return res.status(200).json({ ride: confirmedRide, message: 'Ride confirmed successfully!' });
    } catch (error) {
        console.error('Error accepting ride:', error);
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


module.exports.beginRide = async (req, res) => {
    const validationIssues = validationResult(req);
    if (!validationIssues.isEmpty()) {
        return res.status(400).json({ errors: validationIssues.array(), message: 'Validation errors!' });
    }

    const { rideId, otpCode } = req.query;

    if (!rideId || !otpCode) {
        return res.status(400).json({ message: 'Ride ID and OTP are required!' });
    }

    try {
        const startedRide = await rideService.startRide({ rideId, otp: otpCode, captain: req.driver });

        sendMessageToSocketId(startedRide.passenger.socketId, {
            event: 'ride-started',
            data: startedRide,
        });

        return res.status(200).json({ ride: startedRide, message: 'Ride started successfully!' });
    } catch (error) {
        console.error('Error starting ride:', error);
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


module.exports.completeRide = async (req, res) => {
    const validationIssues = validationResult(req);
    if (!validationIssues.isEmpty()) {
        return res.status(400).json({ errors: validationIssues.array(), message: 'Validation errors!' });
    }

    const { rideId } = req.body;

    if (!rideId) {
        return res.status(400).json({ message: 'Ride ID is required!' });
    }

    try {
        const completedRide = await rideService.endRide({ rideId, captain: req.driver });

        sendMessageToSocketId(completedRide.passenger.socketId, {
            event: 'ride-ended',
            data: completedRide,
        });

        return res.status(200).json({ ride: completedRide, message: 'Ride completed successfully!' });
    } catch (error) {
        console.error('Error completing ride:', error);
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};
