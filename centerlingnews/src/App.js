import React from 'react';
import { Router, Route } from 'react-router-dom';

import { history } from './helpers';

import { HomePage } from './views/HomePage';

class App extends React.Component {

    render() {
        return (
            <div className="container">
                <Router history={history}>
                    <div>
                        <Route exact path="/" component={HomePage} />
                    </div>
                </Router>
            </div>
        );
    }
}

export { App }; 
