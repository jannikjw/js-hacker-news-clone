import React from 'react';
import { Router, Route } from 'react-router-dom';

import { history } from './helpers';

import { HomePage } from './views/HomePage';
import { RegisterPage } from './views/RegisterPage';

class App extends React.Component {

    render() {
        return (
            <div className="container">
                <Router history={history}>
                    <div>
                        <Route exact path="/" component={HomePage} />

                        <Route path="/register" component={RegisterPage} />
                    </div>
                </Router>
            </div>
        );
    }
}

export { App }; 
