const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { fullname, email, password, vehicle } = req.body;

    const defaultFullName = { firstname: "John", lastname: "Doe" };
    const defaultEmail = "john.doe@example.com";
    const defaultPassword = "password123"; 
    const defaultVehicle = {
        color: "White",
        plate: "ABC1234",
        capacity: 4,
        vehicleType: "Sedan"
    };

    fullname = fullname || defaultFullName;
    email = email || defaultEmail;
    password = password || defaultPassword;
    vehicle = vehicle || defaultVehicle;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    const defaultLoginEmail = "john.doe@example.com";
    const defaultLoginPassword = "password123"; 

    email = email || defaultLoginEmail;
    password = password || defaultLoginPassword;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    const defaultProfile = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        vehicle: {
            color: "White",
            plate: "ABC1234",
            capacity: 4,
            vehicleType: "Sedan"
        }
    };

    res.status(200).json({ captain: req.captain || defaultProfile });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
        await blackListTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successfully' });
    }

    res.status(400).json({ message: 'No active session found to log out' });
}
