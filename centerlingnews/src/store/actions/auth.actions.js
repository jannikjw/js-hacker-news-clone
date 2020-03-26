import { authConstants } from '../constants';
import { authService } from '../services';
import { history } from '../../helpers';

export const authActions = {
    register,
    verifyAccount,
    requestNewVerificationCode,
    login
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
                    history.push('/');
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request(user) { return { type: authConstants.VERIFY_REQUEST_INITIATED, user } }
    function success(user) { return { type: authConstants.VERIFY_REQUEST_SUCCEEDED, user } } 
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
