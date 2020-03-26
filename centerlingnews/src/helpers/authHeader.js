export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER));

    if (user && user.token) {
        return { 
            'Authorization': 'Bearer ' + user.token,
            'Content-Type': 'application/json'
        };
    } else {
        return {
            'Content-Type': 'application/json'
        };
    }
}
