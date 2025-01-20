const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

// Utility to generate OTP
function generateOtp(length) {
    return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
}

// Method to calculate fare based on pickup and destination
async function calculateFare(pickup = "Default Pickup", destination = "Default Destination") {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination) || {
        distance: { value: 10000 }, // Default distance: 10 km
        duration: { value: 1800 },  // Default duration: 30 minutes
    };

    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    return {
        auto: Math.round(
            baseFare.auto +
            (distanceTime.distance.value / 1000) * perKmRate.auto +
            (distanceTime.duration.value / 60) * perMinuteRate.auto
        ),
        car: Math.round(
            baseFare.car +
            (distanceTime.distance.value / 1000) * perKmRate.car +
            (distanceTime.duration.value / 60) * perMinuteRate.car
        ),
        moto: Math.round(
            baseFare.moto +
            (distanceTime.distance.value / 1000) * perKmRate.moto +
            (distanceTime.duration.value / 60) * perMinuteRate.moto
        ),
    };
}

// Service Methods
module.exports = {
    async initiateRide({ passenger = "Default Passenger", pickup = "Default Pickup", destination = "Default Destination" }) {
        if (!passenger || !pickup || !destination) {
            throw new Error('All fields are required for initiating a ride');
        }

        return await rideModel.create({ passenger, pickup, destination });
    },

    async createRide({ user = "Default User", pickup = "Default Pickup", destination = "Default Destination", vehicleType = "car" }) {
        if (!user || !pickup || !destination || !vehicleType) {
            throw new Error('All fields are required');
        }

        const fare = await calculateFare(pickup, destination);

        const ride = await rideModel.create({
            user,
            pickup,
            destination,
            otp: generateOtp(6),
            fare: fare[vehicleType],
        });

        return ride;
    },

    async confirmRide({ rideId = "DefaultRideId", captain = { _id: "DefaultCaptainId" } }) {
        if (!rideId) {
            throw new Error('Ride id is required');
        }

        await rideModel.findOneAndUpdate(
            { _id: rideId },
            { status: 'accepted', captain: captain._id }
        );

        const ride = await rideModel
            .findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        return ride;
    },

    async startRide({ rideId = "DefaultRideId", otp = "123456", captain = { _id: "DefaultCaptainId" } }) {
        if (!rideId || !otp) {
            throw new Error('Ride id and OTP are required');
        }

        const ride = await rideModel
            .findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        if (ride.status !== 'accepted') {
            throw new Error('Ride not accepted');
        }

        if (ride.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        await rideModel.findOneAndUpdate(
            { _id: rideId },
            { status: 'ongoing' }
        );

        return ride;
    },

    async endRide({ rideId = "DefaultRideId", captain = { _id: "DefaultCaptainId" } }) {
        if (!rideId) {
            throw new Error('Ride id is required');
        }

        const ride = await rideModel
            .findOne({ _id: rideId, captain: captain._id })
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        if (ride.status !== 'ongoing') {
            throw new Error('Ride not ongoing');
        }

        await rideModel.findOneAndUpdate(
            { _id: rideId },
            { status: 'completed' }
        );

        return ride;
    },
};
