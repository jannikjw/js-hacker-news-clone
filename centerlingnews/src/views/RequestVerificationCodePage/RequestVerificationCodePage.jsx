import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

import qs from 'qs';

import './RequestVerificationCodePage.scss';

class RequestVerificationCodePage extends React.Component {
    constructor(props) {
        super(props);

        const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

        this.state = {
            email: query.email || '',
            submitted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { email } = this.state;
        const { dispatch } = this.props;
        if (this.handleLocalErrors()) {
            dispatch(authActions.requestNewVerificationCode(email));
        }
    }

    handleLocalErrors() {
        const { email } = this.state;
        const { dispatch } = this.props;

        let validationErrors = [];

        if (!email) {
            validationErrors.push({
                value: email,
                msg: 'Email is required.',
                param: 'email',
                location: 'local'
            })
        }

        if (validationErrors.length > 0 ) {
            function failure(error) { return { type: authConstants.SEND_NEW_CODE_REQUEST_FAILED, error } }
            dispatch(failure({
                status: 0,
                message: 'Local Validation Error.',
                data: validationErrors
            }));
            return false
        }

        return true; 
    }

    errorsForField(name) {
        const { errors } = this.props;

        if (!errors) {
            return '';
        }
        if (!errors.data) {
            return '';
        }
        if (!errors.data.length > 0) {
            return '';
        }
        return errors.data
            .filter(e => e.param === name)
            .map(e => <div className="error" key={e.msg}>{e.msg}</div>)
    }

    showLocalErrorMessages() {
        const { errors } = this.props;
        // error messages from the clients should only be shown, if there are now errors from the server yet
        return !errors || !errors.data || !errors.data.length;
    }

    showFieldIndepenentErrorMessage() {
        const { errors } = this.props;
        // only show the field-independet error message, if the are none related to a specific field
        return errors && errors.message && (!errors.data || !errors.data.length);
    }

    render() {
        const { requesting, errors, message } = this.props;
        const { email, submitted } = this.state;

        return (
            <div className="view-forgot-password-page">
                <h2>Request New Verification Code</h2>
                <div className="tagline">Please enter your email to request a new verification code.</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <label htmlFor="email">E-Mail</label>
                        <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                        {
                            this.errorsForField('email')
                        }
                    </div>
                    <div className="form-group">
                        {!requesting &&
                            <input type="submit" className="form-control" name="login" value="Request new code"/>
                        }
                        {requesting &&
                            <input type="submit" className="form-control" name="login" value="Requesting new code ..." disabled/>
                        }
                    </div>
                </form>
                <div className="error-container">
                    {this.showFieldIndepenentErrorMessage() && 
                        <div className="error">{errors.message}</div>
                    }
                </div>
                {message &&
                    <div className="info-container">
                        {message}
                    </div>
                }
                <div className="link-group">
                    <p>
                        {email &&
                            <Link to={`/verify?email=${email}`}>Need to confirm your account?</Link>
                        }
                        {!email &&
                            <Link to={`/verify`}>Need to confirm your account?</Link>
                        }
                    </p>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { requesting, errors, message } = state.requestNewVerificationCode;
    return {
        requesting,
        errors,
        message
    };
}

const connectedRequestVerificationCodePage = connect(mapStateToProps)(RequestVerificationCodePage);
export { connectedRequestVerificationCodePage as RequestVerificationCodePage }; 
