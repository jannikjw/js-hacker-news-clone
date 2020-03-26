import { authHeader } from '../../helpers';

const API_URL = process.env.REACT_APP_API_HOST + '/api'

export const authService = {
    register,
    verifyAccount,
    requestNewVerificationCode,
    login,
    getUser
};

// -----------------
// private functions
// -----------------

// For auth responses a 401 error is expected (e.g. wrong password)
function handleAuthResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = data
            return Promise.reject(error);
        }

        return data;
    });
}

// For other responses a 401 error means that the JWT is expired
// If this is the case, delete the use and perform a hard reload the page
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {

            if (response.status === 401) {
                // auto-logout if 401 response returned from api
                localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER);
                window.location.reload(true);
            }

            const error = data
            return Promise.reject(error);
        }

        return data;
    });
}

// -----------------
// service functions
// -----------------
function register(firstName, lastName, username, email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, email, password })
    };

    return fetch(`${API_URL}/auth/register`, requestOptions)
        .then(handleAuthResponse);
}


function verifyAccount(email, otp) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    };

    return fetch(`${API_URL}/auth/verify-otp`, requestOptions)
        .then(handleAuthResponse)
}

function requestNewVerificationCode(email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };

    return fetch(`${API_URL}/auth/resend-verify-otp`, requestOptions)
        .then(handleAuthResponse)
}

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${API_URL}/auth/login`, requestOptions)
        .then(handleAuthResponse)
}

function getUser() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${API_URL}/auth/user`, requestOptions).then(handleResponse);
}
