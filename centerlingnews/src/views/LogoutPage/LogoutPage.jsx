import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../helpers';

import { authActions } from '../../store/actions';

class LogoutPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(authActions.logout());
        history.push('/');
    }

    render() {
        return (
            <div className="view-logout-page"></div>
        );
    }
}

function mapStateToProps(state) {
    return { };
}

const connectedLogoutPage = connect(mapStateToProps)(LogoutPage);
export { connectedLogoutPage as LogoutPage }; 
