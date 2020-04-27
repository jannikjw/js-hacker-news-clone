import React from "react";
import { authHeader } from "../../helpers";
import qs from "qs";
import Comment from "./Comment";
import { Link } from 'react-router-dom';

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
    this.getComments = this.getComments.bind(this);
    this.getPost = this.getPost.bind(this);
    this.getUser = this.getUser.bind(this);

    this.state = {
      content: query.content || "",
      submitted: false,
      errors: {},
      comments: [],
      post: [],
      user: [],
      upvoteCount: 0,
      createdAt: ""
    };
  }

  getComments() {
    const endpoint = API_URL + "/posts";

    const requestOptions = {
      method: "GET",
    };

    fetch(endpoint + "/" + this.props.match.params.post_id + "/comment", requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({
        comments: data
      }))
      .catch((err) => console.error('Fetch Error :-S', err));
  }

  getPost() {
    const endpoint = API_URL + "/posts";

    const requestOptions = {
      method: "GET",
    };

    fetch(endpoint + "/" + this.props.match.params.post_id, requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({
        post: data,
        upvoteCount: data.upvoters.length,
        createdAt: data.createdAt
      }))
      .catch((err) => console.error('Fetch Error :-S', err));
  }

  getUser() {
    //Get current User
    const endpoint = API_URL + "/auth/user";

    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };

    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((text) => this.setState({ user: text.data }))
      .catch((error) => console.log('Fetch Error :-S', error));
  }

  componentDidMount() {
    this.getComments()
    this.getPost()
    this.getUser()
    //TODO: If post is not found display text: "There is no such post"
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    this.submit(e);
  }

  addComment(comment) {
    const comments = this.state.comments.slice()
    comments.unshift(comment)
    this.setState({ comments: comments })
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

  submit(e) {
    const { content } = this.state;
    const { _id } = this.state.post;

    if (this.validate()) {
      const endpoint = API_URL + "/posts"; // 'api/posts'

      const requestOptions = {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ content }),
      };

      fetch(endpoint + "/" + _id + "/comment", requestOptions)
        .then((response) => {
          return response.text().then((text) => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
              const error = data;
              console.error(error);
              return Promise.reject(error);
            }
            e.value = ''
            let comment = {}
            comment["username"] = this.state.user.username
            comment["content"] = content
            comment["createdAt"] = "just now"
            comment["post"] = _id
            comment["_id"] = "123456789temp"
            this.addComment(comment)
          });
        })
        .catch((err) => {
          let errors = { ...this.state.errors };
          errors["general"] = (
            <div>
              <span className="error">{err.message}</span>
              {(err.status === 401) && <button><Link to={"/login"}>login</Link></button>}
            </div>
          )

          this.setState({
            errors: errors
          });
        });


    }
  }

  render() {
    const { user, errors, comments, post, submitted, content, upvoteCount, createdAt } = this.state

    let hostName = ""
    try { hostName = new URL(post.url).hostname.replace('www.', '') }
    catch (err) { }
    return (
      <div className={`view-post-detail-page`}>
        <table>
          <tbody>
            <tr><td className="title">{post.title}</td></tr>
            <tr><td className="url">({hostName})</td></tr>
            <tr>
              <td>
                <span>{upvoteCount + " " + (upvoteCount === 1 ? "vote" : "votes")}</span>
                <span className="user"> by {post.username} | </span>
                <span> Creation Date: {createdAt.substring(0, 10)}</span>
              </td>
            </tr>
            <tr>
              <td>
                <form name="form" onSubmit={this.handleSubmit}>
                  <div className={"form-group" + (submitted && !content ? " has-error" : "")}>
                    <label>
                      <textarea
                        value={content}
                        onChange={this.handleChange}
                        className="form-control"
                        name="content"
                        rows="5"
                        cols="100"
                        wrap="soft"
                      ></textarea>
                      <div className="error">{errors.content}</div>
                    </label>
                  </div>
                  <div className="error">{errors.general}</div>
                  <input type="submit" className="form-group" value="add Comment" />
                </form>
              </td>
            </tr>
            {comments.map((comment) =>
              <Comment
                className="comment"
                key={comment._id}
                comment={comment}
                user={user}
                deleteComment={this.deleteComment} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

export { PostDetailPage };
