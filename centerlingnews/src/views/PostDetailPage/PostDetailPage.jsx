import React from "react";
import { authHeader } from "../../helpers";
import qs from "qs";

import "./PostDetailPage.scss";

const API_URL = process.env.REACT_APP_API_HOST + "/api";

class PostDetailPage extends React.Component {
  constructor(props) {
    super(props);

    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      postID: "",
      content: query.content || "",
      title: "",
      url: "",
      voteCount: 0,
      author: "",
      submitted: false,
      errors: {},
      createdAt: ""
    };
  }

  componentDidMount() {
    const endpoint = API_URL + "/posts";

    const requestOptions = {
      method: "GET",
    };

    fetch(endpoint + "/" + this.props.match.params.post_id, requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({
        postID: data._id,
        title: data.title,
        url: data.url,
        voteCount: data.upvoters.length,
        author: data.username,
        createdAt: data.createdAt
      }))
      .catch((err) => console.error('Fetch Error :-S', err));
    //TODO: If post is not found display text: "There is no such post"
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

  validate() {
    let errors = {};
    let formIsValid = true;
    const { content } = this.state;

    if (!content) {
      formIsValid = false;
      errors["content"] = "Please enter a comment.";
    }

    this.setState({
      errors: errors,
    });
    return formIsValid;
  }

  submit() {
    const { content, postID } = this.state;

    if (this.validate()) {
      const endpoint = API_URL + "/posts"; // 'api/posts'

      const requestOptions = {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ content }),
      };

      fetch(endpoint + "/" + postID + "/comment", requestOptions)
        .then((response) => {
          return response.text().then((text) => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
              const error = data;
              console.error(error);
              return Promise.reject(error);
            }
            //TODO: Add comment to bottom of page
          });
        })

        .catch((err) => {
          let errors = { ...this.state.errors };
          errors["general"] = <div className="error">{err.message}</div>

          this.setState({
            errors: errors
          });
        });
    }
  }


  render() {
    const { url, title, voteCount, author, content, submitted, createdAt, errors } = this.state;
    let hostName = ""
    try { hostName = new URL(url).hostname.replace('www.', '') }
    catch (err) { }
    //TODO: Show comments below form
    //TODO: Time difference now - createdAt
    return (
      <div className={`view-post-detail-page`}>
        <table>
          <tbody>
            <tr><td>{title}</td></tr>
            <tr><td>{hostName}</td></tr>
            <tr>
              <td>
                <span>{voteCount + " " + (voteCount === 1 ? "vote" : "votes")}</span> by
                <span>{author}</span>
                <span>Creation Date:
                {/* {createdAt.getDate() + "/" + createdAt.getMonth() + "/" + createdAt.getYear()} */}
                  {createdAt.substring(0, 10)}
                </span>
              </td>

            </tr>
            <tr><td>
              <form name="form" onSubmit={this.handleSubmit}>
                <div
                  className={"form-group" + (submitted && !content ? " has-error" : "")}
                >
                  <label>
                    Comment:
                    <input
                      type="text"
                      value={content}
                      onChange={this.handleChange}
                      className="form-control"
                      name="content"
                    />
                    <div className="error">{errors.content}</div>
                  </label>
                </div>
                <div className="error">{errors.general}</div>
                <input type="submit" value="add Comment" />
              </form></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export { PostDetailPage };
