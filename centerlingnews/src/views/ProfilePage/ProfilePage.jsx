import React from 'react';
import { connect } from 'react-redux';

import './ProfilePage.scss';

class ProfilePage extends React.Component {

    render() {
        const { user } = this.props;

        return (
            <div className="view-profile-page">
                {user && 
                    <div className="site-container">
                        <h2>{`Hello, ${user.firstName} ${user.lastName}!`}</h2>

                        <div className='form-group'>
                            <label htmlFor="email">E-mail</label>
                            <input type="text" className="form-control" name="email" value={user.email} disabled/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" name="username" value={user.username} disabled/>
                        </div>
                        
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.login;
    return {
        user
    };
}

const connectedProfilePage = connect(mapStateToProps)(ProfilePage);
export { connectedProfilePage as ProfilePage };
