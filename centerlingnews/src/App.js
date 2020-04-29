import React from "react";
import { connect } from "react-redux";
import { Router, Route } from "react-router-dom";

import { history } from "./helpers";
import { authActions } from "./store/actions";

import { PrivateRoute } from "./components/PrivateRoute";

import { HomePage } from "./views/HomePage";
import { RegisterPage } from "./views/RegisterPage";
import { VerifyPage } from "./views/VerifyPage";
import { RequestVerificationCodePage } from "./views/RequestVerificationCodePage";
import { LoginPage } from "./views/LoginPage";
import { LogoutPage } from "./views/LogoutPage";
import { ProfilePage } from "./views/ProfilePage";
import { ForgotPasswordPage } from "./views/ForgotPasswordPage";
import { ResetPasswordPage } from "./views/ResetPasswordPage";
import { NewPostPage } from "./views/NewPostPage";
import { PostsPage } from "./views/PostsPage";
import { EditPostPage } from "./views/EditPostPage";
import { PostDetailPage } from "./views/PostDetailPage";
import Navbar from "./components/Navbar"


class App extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch, user } = this.props;

    // On initial page load we don't know whether the JWT stores
    // in the localStorage of the browser is still valid.
    // To test the JWT, we try to get the current user.
    //     -> If this fails, it will automatically remove the user and reload the page.
    //     -> If it succeeds, we will can unlock the application
    if (user) {
      dispatch(authActions.getUser());
    }
  }

  shouldShowApplication() {
    const { initialLoadHappened, user } = this.props;
    return !user || initialLoadHappened;
  }

  render() {
    return (
      <div className="container">
        <Router history={history}>
          <Navbar />
          {this.shouldShowApplication() && (
            <div>
              <Route exact path="/" component={HomePage} />

              <Route path="/register" component={RegisterPage} />
              <Route path="/verify" component={VerifyPage} />
              <Route
                path="/request-code"
                component={RequestVerificationCodePage}
              />
              <Route path="/login" component={LoginPage} />
              <Route path="/logout" component={LogoutPage} />
              <Route path="/forgot-password" component={ForgotPasswordPage} />
              <Route path="/reset-password" component={ResetPasswordPage} />
              <PrivateRoute path="/submit" component={NewPostPage} />
              <PrivateRoute path="/profile" component={ProfilePage} />
              <Route exact path="/posts" component={PostsPage} />
              <Route exact path="/posts/:post_id" component={PostDetailPage} />
              <PrivateRoute path="/edit" component={EditPostPage} />
            </div>
          )}
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user, initialLoadHappened } = state.login;
  return {
    user,
    initialLoadHappened,
  };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
