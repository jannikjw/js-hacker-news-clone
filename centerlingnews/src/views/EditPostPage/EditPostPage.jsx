import React from "react";
import qs from "qs";

import { authHeader } from "../../helpers";

import "./EditPostPage.scss";

class EditPostPage extends React.Component {
  constructor(props) {
    super(props);

    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      title: query.title || "",
      url: query.url || "",
      submitted: false,
      errors: {},
      id: ""
    };
  }

  componentDidMount() {

    const API_URL = process.env.REACT_APP_API_HOST + "/api";
    const endpoint = API_URL + "/posts"; // 'api/posts
    const postID = this.props.location.pathname.replace("/edit/", "")

    const requestOptions = {
      method: "GET",
      headers: authHeader()
    }

    fetch(endpoint + "/" + postID, requestOptions)
      .then((response) => {
        response.json().then((data) => {
          this.setState({
            title: data.title,
            url: data.url
          })
        })
      })
      .catch((error) => {
        console.log('Fetch Error :-S', error)
      });
  }

  validate() {
    let errors = {};
    let formIsValid = true;
    const { title, url } = this.state;

    if (!title) {
      formIsValid = false;
      errors["title"] = "Please enter a title.";
    }

    if (!url) {
      formIsValid = false;
      errors["url"] = "Please enter a URL.";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    this.submit();
  }

  render() {
    const { title, url, submitted } = this.state;
    return (
      <div className={`view-edit-post-page`}>
        <h2>Centerling News: Edit your Post!</h2>
        <form name="form" onSubmit={this.handleSubmit}>
          <div
            className={"form-group" + (submitted && !title ? " has-error" : "")}
          >
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={this.handleChange}
                className="form-control"
                name="title"
              />
              <div className="error">{this.state.errors.title}</div>
            </label>
          </div>
          <div
            className={"form-group" + (submitted && !url ? " has-error" : "")}
          >
            <label>
              URL:
              <input
                type="text"
                value={url}
                onChange={this.handleChange}
                className="form-control"
                name="url"
              />
              <div className="error">{this.state.errors.url}</div>
            </label>
          </div>
          <div className="error">{this.state.errors.general}</div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  submit() {
    const { title, url } = this.state;
    const postID = this.props.location.pathname.replace("/edit/", "")


    if (this.validate()) {
      const API_URL = process.env.REACT_APP_API_HOST + "/api";
      const endpoint = API_URL + "/posts"; // 'api/posts'

      const requestOptions = {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ title, url }),
      };

      fetch(endpoint + "/" + postID, requestOptions)
        .then((response) => {
          return response.text().then((text) => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
              const error = data;
              console.log(error);
              return Promise.reject(error);
            }
            console.log(data);
            alert("We have created your post");
          });
        })

        .catch((err) => {
          let errors = this.state.errors;
          console.log(err)
          errors["general"] = err.data.map((e) => (
            <div className="error">{e.msg}</div>
          ));

          this.setState({
            errors: errors,
          });
        });
    }

    window.location = '/posts'
  }
}

export { EditPostPage };
