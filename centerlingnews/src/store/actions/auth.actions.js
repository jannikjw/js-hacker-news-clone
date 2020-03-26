import { authConstants } from '../constants';
import { authService } from '../services';
import { history } from '../../helpers';

export const authActions = {
    register,
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
