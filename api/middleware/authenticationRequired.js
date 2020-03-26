const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const apiResponse = require("../helpers/apiResponse");

// this middleware will throw an error, if there is no valid JWT in the request header
const authenticationRequired = (req, res, next) => {
        const authHeader = req.headers.authorization;


        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            jwt.verify(token, secret, (err, user) => {
                if (err) {
                    return apiResponse.unauthorizedResponse(res, 'Invalid token.');
                }

                req.user = user;
                next();
            });
        } else {
            return apiResponse.unauthorizedResponse(res, 'No authorization token was found');
        }
}

module.exports = authenticationRequired;
