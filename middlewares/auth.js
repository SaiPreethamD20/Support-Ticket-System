const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const auth = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        async (req, res, next) => {
            const token = req.header('Authorization').replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({
                    msg: 'No token, authorization denied'
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.user.id).select('-password');

                if (roles.length && !roles.includes(req.user.role)) {
                    return res.status(403).json({
                        msg: 'Access denied'
                    });
                }

                next();
            } catch (err) {
                res.status(401).json({
                    msg: 'Token is not valid'
                });
            }
        }
    ];
};

module.exports = auth;
