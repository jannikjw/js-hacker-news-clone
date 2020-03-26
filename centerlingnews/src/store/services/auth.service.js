
const API_URL = process.env.REACT_APP_API_HOST + '/api'

export const authService = {
    register,
    verifyAccount,
    requestNewVerificationCode,
    login
};

// -----------------
// private functions
// -----------------

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