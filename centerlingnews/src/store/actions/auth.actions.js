import { authConstants } from '../constants';
import { authService } from '../services';
import { history } from '../../helpers';

export const authActions = {
    register,
    verifyAccount,
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
