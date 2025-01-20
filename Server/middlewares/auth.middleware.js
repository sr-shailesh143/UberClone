const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const user = await userModel.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user; // Attach user to request
        next(); // Proceed to the next middleware/handler
    } catch (err) {
        console.log('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


module.exports.authCaptain = async (req, res, next) => {
    const captainToken = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!captainToken) {
        return res.status(401).json({ message: '🚫 Unauthorized, please log in as captain!' });
    }

    const isCaptainTokenBlacklisted = await blackListTokenModel.findOne({ token: captainToken });

    if (isCaptainTokenBlacklisted) {
        return res.status(401).json({ message: '🚫 Unauthorized, your captain token is blacklisted!' });
    }

    try {
        const decodedCaptainData = jwt.verify(captainToken, process.env.JWT_SECRET);
        const authenticatedCaptain = await captainModel.findById(decodedCaptainData._id);

        req.captain = authenticatedCaptain;
        return next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: '🚫 Unauthorized, token verification failed for captain!' });
    }
}
