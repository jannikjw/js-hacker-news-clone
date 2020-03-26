import React from 'react';
import { connect } from 'react-redux';

import './VerifyPage.scss';

class VerifyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            otp: '',
            submitted: false,
        };
    }
    render() {
        return (
            <div className="view-verify-page">
  
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { verifying, errors } = state.verify;
    return {
        verifying,
        errors
    };
}

const connectedVerifyPage = connect(mapStateToProps)(VerifyPage);
export { connectedVerifyPage as VerifyPage }; 