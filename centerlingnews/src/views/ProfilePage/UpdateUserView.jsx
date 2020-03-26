import React from 'react';
import { connect } from 'react-redux';

import { authActions } from '../../store/actions';
import { authConstants } from '../../store/constants';

class UpdateUserView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
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
        const { firstName, lastName } = this.state;
        const { dispatch } = this.props;
        if (this.handleLocalErrorsFor()) {
            dispatch(authActions.updateUser(firstName, lastName));
        }
    }

    handleLocalErrorsFor() {
        const { firstName, lastName } = this.state;
        const { dispatch } = this.props;

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

    fieldHasError(name) {
        return this.errorsForField(name).length > 0
    }

    showFieldIndepenentErrorMessage() {
        const { errors } = this.props;
        // only show the field-independet error message, if the are none related to a specific field
        return errors && errors.message && (!errors.data || !errors.data.length);
    }

    render() {
        const { updating, errors } = this.props;
        const { firstName, lastName, submitted } = this.state;

        return (
            <div className="view-update-user">
                <h5>Update your name.</h5>
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
                    <div className="form-group">
                        {!updating &&
                            <input type="submit" className="form-control" name="submit" value="Update Name"/>
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
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loading, errors, user } = state.login;
    return {
        loading,
        errors,
        user
    };
}

const connectedUpdateUserView = connect(mapStateToProps)(UpdateUserView);
export { connectedUpdateUserView as UpdateUserView };
