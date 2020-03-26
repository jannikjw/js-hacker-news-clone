const { validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");

const rejectRequestsWithValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
    } else {
        next();
    }
}

module.exports = rejectRequestsWithValidationErrors;
