import React from 'react';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

class UpdatePasswordView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: '',
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
        const { password, newPassword } = this.state;
        const { dispatch } = this.props;
        if (this.handleLocalErrorsFor()) {
            dispatch(authActions.updatePassword(password, newPassword));
        }
    }

    handleLocalErrorsFor() {
        const { password, newPassword, confirmPassword } = this.state;
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

        if (!newPassword) {
            validationErrors.push({
                value: newPassword,
                msg: 'A new password is required.',
                param: 'newPassword',
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

        if (confirmPassword && newPassword !== confirmPassword) {
            validationErrors.push({
                value: confirmPassword,
                msg: 'The passwords do not match.',
                param: 'confirmPassword',
                location: 'local'
            })
        }

        if (validationErrors.length > 0 ) {
            function failure(error) { return { type: authConstants.UPDATE_PW_REQUEST_FAILED, error } }
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

    showFieldIndepenentErrorMessage() {
        const { errors } = this.props;
        // only show the field-independet error message, if the are none related to a specific field
        return errors && errors.message && (!errors.data || !errors.data.length);
    }

    render() {
        const { updating, message, errors } = this.props;
        const { password, newPassword, confirmPassword, submitted } = this.state;

        return (
            <div className="view-update-password">
                <h5>Change your password.</h5>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {
                            this.errorsForField('password')
                        }
                    </div>
                    <div className={'form-group' + (submitted && !newPassword ? ' has-error' : '')}>
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password" className="form-control" name="newPassword" value={newPassword} onChange={this.handleChange} />
                        {
                            this.errorsForField('newPassword')
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
                        {!updating &&
                            <input type="submit" className="form-control" name="submit" value="Update password"/>
                        }
                        {updating &&
                            <input type="submit" className="form-control" name="submit" value="Updating ..." disabled/>
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
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { updating, errors, message} = state.updatePassword;
    const { user } = state.login;
    return {
        updating,
        errors,
        message,
        user
    };
}

const connectedUpdatePasswordView = connect(mapStateToProps)(UpdatePasswordView);
export { connectedUpdatePasswordView as UpdatePasswordView };
