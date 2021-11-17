import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

import qs from 'qs';

import './ResetPasswordPage.scss';

class ResetPasswordPage extends React.Component {
    constructor(props) {
        super(props);

        const { history } = this.props;
        const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

        this.state = {
            token: query.token || '',
            password: '',
            confirmPassword: '',
            submitted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // redirect if someone wants to access the page without a token
        if (!this.state.token) {
            history.push('/login')
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { token, password } = this.state;
        const { dispatch } = this.props;
        if (this.handleLocalErrors()) {
            dispatch(authActions.resetPassword(token, password));
        }
    }

    handleLocalErrors() {
        const { password, confirmPassword } = this.state;
        const { dispatch } = this.props;

        let validationErrors = [];

        if (!password) {
            validationErrors.push({
                value: password,
                msg: 'Password is required.',
                param: 'password',
                location: 'local'
            })
        }

        if (!confirmPassword) {
            validationErrors.push({
                value: confirmPassword,
                msg: 'Password confirmation is required.',
                param: 'confirmPassword',
                location: 'local'
            })
        }

        if (confirmPassword && password !== confirmPassword) {
            validationErrors.push({
                value: confirmPassword,
                msg: 'The passwords do not match.',
                param: 'confirmPassword',
                location: 'local'
            })
        }

        if (validationErrors.length > 0 ) {
            function failure(error) { return { type: authConstants.RESET_PW_REQUEST_FAILED, error } }
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

    fieldHasError(name) {
        return this.errorsForField(name).length > 0
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
        const { resetting, errors, message } = this.props;
        const { password, confirmPassword, submitted } = this.state;

        return (
            <div className="view-reset-password-page">
                <div className="col-md-6">
                    <h2>Reset Password</h2>
                    <div className="tagline">Please enter a new password.</div>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                            {
                                this.errorsForField('password')
                            }
                        </div>
                        <div className={'form-group' + (submitted && this.fieldHasError('confirmPassword') ? ' has-error' : '')}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={this.handleChange} />
                            {
                                this.errorsForField('confirmPassword')
                            }
                        </div>
                        <div className="form-group">
                            {!resetting &&
                                <input type="submit" className="form-control" name="login" value="Reset password"/>
                            }
                            {resetting &&
                                <input type="submit" className="form-control" name="login" value="Resetting password ..." disabled/>
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
                            <Link to="/login">Login</Link>
                        </p>
                        <p>
                            <Link to="/forgot-password">Request New Link</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { resetting, errors, message } = state.resetPassword;
    return {
        resetting,
        errors,
        message
    };
}

const connectedResetPasswordPage = connect(mapStateToProps)(ResetPasswordPage);
export { connectedResetPasswordPage as ResetPasswordPage }; 