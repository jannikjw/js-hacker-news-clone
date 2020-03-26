import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './RegisterPage.scss';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
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
        if (this.handleLocalErrors()) {
            // Todo: Make API call
        }
    }

    handleLocalErrors() {
        const { firstName, lastName, username, email, password, confirmPassword } = this.state;

        let validationErrors = [];

        if (!firstName) {
            validationErrors.push({
                value: firstName,
                msg: 'Your first name is required.',
                param: 'firstName',
                location: 'local'
            })
        }

        if (!lastName) {
            validationErrors.push({
                value: lastName,
                msg: 'Your last name is required.',
                param: 'lastName',
                location: 'local'
            })
        }

        if (!username) {
            validationErrors.push({
                value: username,
                msg: 'Your username is required.',
                param: 'username',
                location: 'local'
            })
        }

        if (!email) {
            validationErrors.push({
                value: email,
                msg: 'Email is required.',
                param: 'email',
                location: 'local'
            })
        }

        if (!password) {
            validationErrors.push({
                value: email,
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
            // Todo: Show errors
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
        const { firstName, lastName, username, email, password, confirmPassword, submitted } = this.state;

        return (
            <div className="view-register-page">
                <h2>Register</h2>
                <div className="tagline">Create a new account to upvote and comment.</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !firstName ? ' has-error' : '')}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" name="firstName" value={firstName} onChange={this.handleChange} />
                        {
                            this.errorsForField('firstName')
                        }
                    </div>
                    <div className={'form-group' + (submitted && !lastName ? ' has-error' : '')}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={lastName} onChange={this.handleChange} />
                        {
                            this.errorsForField('lastName')
                        }
                    </div>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {
                            this.errorsForField('username')
                        }
                    </div>
                    <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <label htmlFor="email">E-Mail</label>
                        <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                        {
                            this.errorsForField('email')
                        }
                    </div>
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
                        {!registering &&
                            <input type="submit" className="form-control" name="login" value="Create Account"/>
                        }
                        {registering &&
                            <input type="submit" className="form-control" name="login" value="Creating account ..." disabled/>
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
                        <Link to="/login">Already have an account?</Link>
                    </p>
                    <p>
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </p>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { registering, errors } = state.register;
    return {
        registering,
        errors
    };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as RegisterPage }; 
