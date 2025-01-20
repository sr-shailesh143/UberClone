const UserModel = require('../models/user.model');
const UserService = require('../services/user.service');
const { validationResult } = require('express-validator');
const TokenBlacklistModel = require('../models/blackListToken.model');

module.exports.registerNewUser = async (req, res, next) => {
    const validationIssues = validationResult(req);
    if (!validationIssues.isEmpty()) {
        return res.status(400).json({ errors: validationIssues.array(), message: '❌ Validation failed!' });
    }

    const { fullname, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: '⚠️ Account already exists. Please log in!' });
    }

    const encryptedPassword = await UserModel.hashPassword(password);

    const createdUser = await UserService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: encryptedPassword,
    });

    const generatedToken = createdUser.generateAuthToken();

    res.status(201).json({ token: generatedToken, user: createdUser, message: '🎉 Registration successful!' });
};

module.exports.loginExistingUser = async (req, res, next) => {
    const validationIssues = validationResult(req);
    if (!validationIssues.isEmpty()) {
        return res.status(400).json({ errors: validationIssues.array(), message: '❌ Validation failed!' });
    }

    const { email, password } = req.body;

    const retrievedUser = await UserModel.findOne({ email }).select('+password');

    if (!retrievedUser) {
        return res.status(401).json({ message: '🚫 Incorrect email or password!' });
    }

    const passwordMatch = await retrievedUser.comparePassword(password);

    if (!passwordMatch) {
        return res.status(401).json({ message: '🚫 Incorrect email or password!' });
    }

    const generatedToken = retrievedUser.generateAuthToken();

    res.cookie('authToken', generatedToken);

    res.status(200).json({ token: generatedToken, user: retrievedUser, message: '✅ Login successful!' });
};

module.exports.fetchUserProfile = async (req, res, next) => {
    res.status(200).json({ user: req.user, message: '👤 User profile successfully retrieved!' });
};

module.exports.logoutCurrentUser = async (req, res, next) => {
    res.clearCookie('authToken');
    const activeToken = req.cookies.authToken || req.headers.authorization.split(' ')[1];

    await TokenBlacklistModel.create({ token: activeToken });

    res.status(200).json({ message: '👋 Successfully logged out!' });
};
