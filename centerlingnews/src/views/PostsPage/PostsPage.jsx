import React from "react";

import "./PostsPage.scss";

const Post = props => (
  <tr>
    <td>
      <a to={props.post.url}>{props.post.title}</a>
    </td>
    <td>{props.post.url}</td>
    <td>{props.post.username}</td>
  </tr>
)


class PostsPage extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      posts: []
    };
  }

  postList() {
    return this.state.posts.map(currentPost => {
      return <Post post={currentPost} key={currentPost._id} />;
    })
  }

  componentDidMount() {
    const API_URL = process.env.REACT_APP_API_HOST + "/api";
    const endpoint = API_URL + "/posts"; // 'api/posts

    fetch(endpoint)
      .then((response) => {
        response.json().then((data) => {
          this.setState({ posts: data })
        });
      })
      .catch((error) => {
        console.log('Fetch Error :-S', error)
      })
      ;
  }

  render() {
    console.log(this.posts)
    return (
      <div className={`view-posts-page`}>
        <h2>Centerling News: All Posts!</h2>
        <table>
          <tbody>
            {this.postList()}
          </tbody>
        </table>
      </div>
    );
  }

}

export { PostsPage };
