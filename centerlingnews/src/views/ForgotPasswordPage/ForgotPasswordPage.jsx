import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

import qs from 'qs';

import './ForgotPasswordPage.scss';

class ForgotPasswordPage extends React.Component {
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
            dispatch(authActions.requestPasswordResetLink(email));
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
            function failure(error) { return { type: authConstants.FORGOT_PW_REQUEST_FAILED, error } }
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
        const { sending, errors, message } = this.props;
        const { email, submitted } = this.state;

        return (
            <div className="view-forgot-password-page">
                <h2>Reset Your Password</h2>
                <div className="tagline">Enter your email to request a password reset link.</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <label htmlFor="email">E-Mail</label>
                        <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                        {
                            this.errorsForField('email')
                        }
                    </div>
                    <div className="form-group">
                        {!sending &&
                            <input type="submit" className="form-control" name="login" value="Request reset link"/>
                        }
                        {sending &&
                            <input type="submit" className="form-control" name="login" value="Sending reset instructions ..." disabled/>
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
                            <Link to={`/login?email=${email}`}>Remember your password? Login</Link>
                        }
                        {!email &&
                            <Link to={`/login`}>Remember your password? Login</Link>
                        }
                    </p>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { sending, errors, message } = state.forgotPassword;
    return {
        sending,
        errors,
        message
    };
}

const connectedForgotPasswordPage = connect(mapStateToProps)(ForgotPasswordPage);
export { connectedForgotPasswordPage as ForgotPasswordPage }; 
