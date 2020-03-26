import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authConstants } from '../../store/constants';

import './VerifyPage.scss';

class VerifyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            otp: '',
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
        this.submit();
    }

    submit() {
        this.setState({ submitted: true });
        if (this.handleLocalErrors()) {
            // Todo: Submit verification Code
        }
    }

    handleLocalErrors() {
        const { email, otp } = this.state;
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

        if (!otp) {
            validationErrors.push({
                value: email,
                msg: 'Verification Code is required.',
                param: 'otp',
                location: 'local'
            })
        }

        if (validationErrors.length > 0 ) {
            function failure(error) { return { type: authConstants.VERIFY_REQUEST_FAILED, error } }
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
        const { verifying, errors } = this.props;
        const { email, otp, submitted } = this.state;

        return (
            <div className="view-verify-page">
                <div className="col-md-6">
                    <h2>Verify Your Account</h2>
                    <div className="tagline">Please enter the code we have just sent to your email.</div>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                            <label htmlFor="email">E-Mail</label>
                            <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                            {
                                this.errorsForField('email')
                            }
                        </div>
                        <div className={'form-group' + (submitted && !otp ? ' has-error' : '')}>
                            <label htmlFor="otp">Verification Code</label>
                            <input type="text" className="form-control" name="otp" value={otp} onChange={this.handleChange} />
                            {
                                this.errorsForField('otp')
                            }
                        </div>
                        <div className="form-group">
                            {!verifying &&
                                <input type="submit" className="form-control" name="login" value="Verify Account"/>
                            }
                            {verifying &&
                                <input type="submit" className="form-control" name="login" value="Verifying account ..." disabled/>
                            }
                        </div>
                    </form>
                    <div className="error-container">
                        {this.showFieldIndepenentErrorMessage() && 
                            <div className="error">{errors.message}</div>
                        }
                    </div>
                    <div className="link-group">
                        <p>
                            {email &&
                                <Link to={`/login?email=${email}`}>Account confirmed? Login</Link>
                            }
                            {!email &&
                                <Link to={`/login`}>Account confirmed? Login</Link>
                            }
                        </p>
                        <p>
                            {email &&
                                <Link to={`/request-code?email=${email}`}>Request a new code</Link>
                            }
                            {!email &&
                                <Link to={`/request-code`}>Request a new code</Link>
                            }
                        </p>
                    </div>
                </div>
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