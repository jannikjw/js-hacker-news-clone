import React from "react";
import { Link } from 'react-router-dom';
import { authHeader } from "../../helpers";

import "./PostsPage.scss";

const API_URL = process.env.REACT_APP_API_HOST + "/api";

class PostsPage extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.deletePost = this.deletePost.bind(this);

    this.state = {
      posts: [],
      currentUser: ''
    };
  }

  postList() {
    let count = 0;
    return this.state.posts.map(currentPost => {
      count++;
      let hostName = new URL(currentPost.url).hostname;
      hostName = hostName.replace('www.', '');

      return (
        <React.Fragment key={currentPost._id}>
          <tr>
            <td className="title">{count}</td>
            <td>
              <a href={currentPost.url} rel="noopener noreferrer" target="_blank" className="title">{currentPost.title}</a>
              <span className="url"> (<a href={currentPost.url} rel="noopener noreferrer" target="blank"><span>{hostName}</span></a>)</span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td><Link className="user" to={"/user/" + currentPost.author}>{currentPost.username} </Link></td>
            {this.showDelete(currentPost._id, currentPost.author)}
          </tr>
          <tr></tr>
        </React.Fragment>
      );
    })
  }

  showDelete(postID, author) {
    console.log(this.state.currentUser.username)
    if (this.state.currentUser._id === author) {
      console.log("Got here")
      return (
        <td><button onClick={() => { this.deletePost(postID) }}>delete</button></td>
      )
    }
  }

  componentDidMount() {
    const endpoint = API_URL + "/posts"; // 'api/posts
    this.setState({ currentUser: JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER)) });

    fetch(endpoint)
      .then((response) => {
        response.json().then((data) => {
          data.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
          })
          data.reverse()
          this.setState({ posts: data })
        });
      })
      .catch((error) => {
        console.log('Fetch Error :-S', error)
      });
  }

  deletePost(id) {
    const API_URL = process.env.REACT_APP_API_HOST + "/api";
    const endpoint = API_URL + "/posts"; // 'api/posts

    const requestOptions = {
      method: "DELETE",
      headers: authHeader(),
    };

    fetch(endpoint + "/" + id, requestOptions)
      .then(response => { console.log(response.data) });

    this.setState({
      posts: this.state.posts.filter(po => po._id !== id)
    })
  }

  render() {
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
