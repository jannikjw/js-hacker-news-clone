import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (

    <Route {...rest} render={props => (
        localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER)
            ? <Component {...props} />
            : <Redirect to={
                    { 
                        pathname: `/login`,
                        search: `?redirect=${encodeURIComponent(props.location.pathname)}`,
                        state: { from: props.location } 
                    }
                } />
    )} />
)
