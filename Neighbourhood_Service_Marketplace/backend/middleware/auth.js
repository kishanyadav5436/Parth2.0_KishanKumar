const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

const isProvider = (req, res, next) => {
    if (req.user && (req.user.role === 'provider' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Requires Provider Role' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Requires Admin Role' });
    }
};

module.exports = { verifyToken, isProvider, isAdmin };
