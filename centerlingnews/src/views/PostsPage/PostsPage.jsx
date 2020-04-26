import React from "react";
import { Link } from 'react-router-dom';
import { authHeader } from "../../helpers";
import PostRow from "./PostRow";

import "./PostsPage.scss";

const API_URL = process.env.REACT_APP_API_HOST + "/api";

class PostsPage extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getPosts = this.getPosts.bind(this);

    this.state = {
      posts: [],
      currentUser: [],
    };
  }

  getCurrentUser() {
    //Get current User
    const endpoint = API_URL + "/auth/user";

    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };

    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((text) => this.setState({ currentUser: text.data }))
      .catch((error) => console.log('Fetch Error :-S', error));
  }

  getPosts() {
    //gets Array of all posts
    const endpoint = API_URL + "/posts"; // 'api/posts

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        //TODO: posts should be sorted in backend
        data.sort(function (a, b) { return new Date(b.date) - new Date(a.date) })
        data.reverse()
        this.setState({ posts: data })
      })
      .catch((error) => {
        console.log('Fetch Error :-S', error)
      });
  }

  componentDidMount() {
    this.getCurrentUser();
    this.getPosts();
  }

  deletePost(postID) {
    this.setState({ posts: this.state.filter(po => po._id !== postID) })
  }

  render() {
    return (
      <div className={`view-posts-page`}>
        <h2>Centerling News</h2>
        <table>
          <tbody>
            {this.state.posts.map((post, index) =>
              <PostRow
                key={post._id}
                post={post}
                index={index}
                userID={this.state.currentUser._id}
                deletePost={this.deletePost} />)}
          </tbody>
        </table>
      </div>
    );
  }

}

export { PostsPage };
