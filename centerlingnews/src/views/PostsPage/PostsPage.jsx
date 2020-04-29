import React from "react";
import { authHeader } from "../../helpers";
import PostRow from "./PostRow";

import "./PostsPage.scss";

const API_URL = process.env.REACT_APP_API_HOST + "/api";

class PostsPage extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getPosts = this.getPosts.bind(this);

    this.state = {
      posts: [],
      currentUser: [],
    };
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
      .then((text) => this.setState({ currentUser: text.data }))
      .catch((error) => console.log('Fetch Error :-S', error));
  }

  getPosts() {
    //gets Array of all posts
    const endpoint = API_URL + "/posts"; // 'api/posts

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => this.setState({ posts: data }))
      .catch((error) => {
        console.error('Fetch Error :-S', error)
      });
  }

  componentDidMount() {
    this.getUser();
    this.getPosts();
  }

  deletePost(postID) {
    this.setState({ posts: this.state.filter(po => po._id !== postID) })
  }

  render() {
    const { currentUser, posts } = this.state
    return (
      <div className={`view-posts-page`}>
        <h2>Centerling News</h2>
        <table>
          {posts.map((post, index) =>
            <PostRow
              key={post._id}
              post={post}
              index={index}
              userID={currentUser && currentUser._id}
              deletePost={this.deletePost} />)}
        </table>
      </div>
    );
  }

}

export { PostsPage };
