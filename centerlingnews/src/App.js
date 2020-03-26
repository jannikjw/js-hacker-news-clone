import React from 'react';
import { Router, Route } from 'react-router-dom';

import { history } from './helpers';

import { HomePage } from './views/HomePage';
import { RegisterPage } from './views/RegisterPage';
import { VerifyPage } from './views/VerifyPage';
import { RequestVerificationCodePage } from './views/RequestVerificationCodePage';

class App extends React.Component {

    render() {
        return (
            <div className="container">
                <Router history={history}>
                    <div>
                        <Route exact path="/" component={HomePage} />

                        <Route path="/register" component={RegisterPage} />
                        <Route path="/verify" component={VerifyPage} />
                        <Route path="/request-code" component={RequestVerificationCodePage} />

                    </div>
                </Router>
            </div>
        );
    }
}

export { App }; 
