import { authConstants } from '../constants';
import { authService } from '../services';
import { history } from '../../helpers';

export const authActions = {
    register,
    verifyAccount,
    requestNewVerificationCode,
    login,
    getUser,
    logout,
    updateUser,
    updatePassword,
    requestPasswordResetLink
};

function register(firstName, lastName, username, email, password) {
    return dispatch => {
        dispatch(request({ email }));

        authService.register(firstName, lastName, username, email, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/verify?email=' + user.data.email );
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(user) { return { type: authConstants.REGISTER_REQUEST_INITIATED, user } }
    function success(user) { return { type: authConstants.REGISTER_REQUEST_SUCCEEDED, user } }
    function failure(error) { return { type: authConstants.REGISTER_REQUEST_FAILED, error } }
}

function verifyAccount(email, otp) {
    return dispatch => {
        dispatch(request({ email }));

        authService.verifyAccount(email, otp)
            .then(
                response => { 
                    const user = response.data
                    dispatch(success(user));
                    dispatch(login(user)); // log the user in automatically after confirming their account
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(user) { return { type: authConstants.VERIFY_REQUEST_INITIATED, user } }
    function success(user) { return { type: authConstants.VERIFY_REQUEST_SUCCEEDED, user } }
    function login(user) { return { type: authConstants.LOGIN_REQUEST_SUCCEEDED, user } }
    function failure(error) { return { type: authConstants.VERIFY_REQUEST_FAILED, error } }
}

function requestNewVerificationCode(email) {
    return dispatch => {
        dispatch(request({ email }));

        authService.requestNewVerificationCode(email)
            .then(
                response => {
                    const message = response.message
                    dispatch(success(message));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(message) { return { type: authConstants.SEND_NEW_CODE_REQUEST_INITIATED, message } }
    function success(message) { return { type: authConstants.SEND_NEW_CODE_REQUEST_SUCCEEDED, message } }
    function failure(error) { return { type: authConstants.SEND_NEW_CODE_REQUEST_FAILED, error } }
}

function login(email, password, redirect) {
    return dispatch => {
        dispatch(request({ email }));

        authService.login(email, password)
            .then(
                response => { 
                    const user = response.data
                    dispatch(success(user));
                    history.push(redirect || '/');
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(user) { return { type: authConstants.LOGIN_REQUEST_INITIATED, user } }
    function success(user) { return { type: authConstants.LOGIN_REQUEST_SUCCEEDED, user } }
    function failure(error) { return { type: authConstants.LOGIN_REQUEST_FAILED, error } }
}

function getUser() {
    return dispatch => {
        dispatch(request());

        authService.getUser()
            .then(
                response => dispatch(success(response.data)),
                error => dispatch(failure(error))
            );
    };

    // Piggy-back on the Login Reducer here
    // This function should be only called to check whether the JWT is valid, so there is no harm in doing so.
    function request() { return { type: authConstants.LOGIN_REQUEST_INITIATED } }
    function success(user) { return { type: authConstants.LOGIN_REQUEST_SUCCEEDED, user } }
    function failure(error) { return { type: authConstants.LOGIN_REQUEST_FAILED, error } }
}

function logout() {
    return dispatch => {
        dispatch({ type: authConstants.LOGOUT_SUCCEEDED });
    };
}

function updateUser(firstName, lastName) {
    return dispatch => {
        dispatch(request());

        authService.updateUser(firstName, lastName)
            .then(
                response => dispatch(success(response.data)),
                error => {
                    dispatch(failure(error));
                }
            );
    };

    // Piggy-back on the Login Reducer here
    // This function should be only called to check whether the JWT is valid, so there is no harm in doing so.
    function request() { return { type: authConstants.LOGIN_REQUEST_INITIATED } }
    function success(user) { return { type: authConstants.LOGIN_REQUEST_SUCCEEDED, user } }
    function failure(error) { return { type: authConstants.LOGIN_REQUEST_FAILED, error } }
}

function updatePassword(password, newPassword) {
    return dispatch => {
        dispatch(request());

        authService.updatePassword(password, newPassword)
            .then(
                response => {
                    const message = response.message
                    dispatch(success(message));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: authConstants.UPDATE_PW_REQUEST_INITIATED } }
    function success(message) { return { type: authConstants.UPDATE_PW_REQUEST_SUCCEEDED, message } }
    function failure(error) { return { type: authConstants.UPDATE_PW_REQUEST_FAILED, error } }
}


function requestPasswordResetLink(email) {
    return dispatch => {
        dispatch(request({ email }));

        authService.requestPasswordResetLink(email)
            .then(
                response => {
                    const message = response.message
                    dispatch(success(message));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(message) { return { type: authConstants.FORGOT_PW_REQUEST_INITIATED, message } }
    function success(message) { return { type: authConstants.FORGOT_PW_REQUEST_SUCCEEDED, message } }
    function failure(error) { return { type: authConstants.FORGOT_PW_REQUEST_FAILED, error } }
}
