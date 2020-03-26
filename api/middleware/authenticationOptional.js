const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// this middleware will inject the user, if they are authenticated
const authenticationOptional = (req, res, next) => {
        const authHeader = req.headers.authorization;
    
        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            jwt.verify(token, secret, (err, user) => {
                if (!err && user) {
                    req.user = user;
                }
            });
        } 
        // no matter what happens, call next
        next();
}

module.exports = authenticationOptional;
