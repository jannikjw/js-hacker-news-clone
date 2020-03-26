import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

import qs from 'qs';

import './LoginPage.scss';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

        this.state = {
            redirect: query.redirect || '/',
            email: query.email || '',
            password: '',
            submitted: false
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
        const { email, password, redirect } = this.state;
        const { dispatch } = this.props;
        if (this.handleLocalErrors()) {
            dispatch(authActions.login(email, password, redirect));
        }
    }

    handleLocalErrors() {
        const { email, password } = this.state;
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

        if (!password) {
            validationErrors.push({
                value: password,
                msg: 'Password is required.',
                param: 'password',
                location: 'local'
            })
        }

        if (validationErrors.length > 0 ) {
            function failure(error) { return { type: authConstants.LOGIN_REQUEST_FAILED, error } }
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

    showFieldIndepenentErrorMessage() {
        const { errors } = this.props;
        // only show the field-independet error message, if the are none related to a specific field
        return errors && errors.message && (!errors.data || !errors.data.length);
    }

    render() {
        const { loading, errors } = this.props;
        const { email, password, submitted } = this.state;
        return (
            <div className="view-login-page">
                <h2>Login</h2>
                <div className="tagline">Sign in to upvote posts and write comments.</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <label htmlFor="email">email</label>
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
                    <div className="form-group">
                        {!loading &&
                            <input type="submit" className="form-control" name="login" value="Login"/>
                        }
                        {loading &&
                            <input type="submit" className="form-control" name="login" value="Logging in ..." disabled/>
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
                        <Link to="/register">Want to create a new account?</Link>
                    </p>
                    <p>
                        {email &&
                            <Link to={`/forgot-password?email=${email}`}>Forgot your password?</Link>
                        }
                        {!email &&
                            <Link to={`/forgot-password`}>Forgot your password?</Link>
                        }
                    </p>
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
    const { loading, errors } = state.login;
    return {
        loading,
        errors
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 