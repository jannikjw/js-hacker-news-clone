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
      currentUser: []
    };
  }

  componentDidMount() {
    const endpointPost = API_URL + "/posts"; // 'api/posts

    fetch(endpointPost)
      .then((response) => {
        response.json().then((data) => {
          //TODO: posts should be sorted in backend
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

    const endpointUser = API_URL + "/auth/user";

    const requestOptions = {
      method: "GET",
      headers: authHeader(),
    };

    fetch(endpointUser, requestOptions)
      .then((response) => {
        response.json().then((text) => {
          this.setState({ currentUser: text.data })
        });
      })
      .catch((error) => {
        console.log('Fetch Error :-S', error)
      });
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
            {this.showEdit(currentPost)}
            {this.showDelete(currentPost)}
          </tr>
          <tr></tr>
        </React.Fragment>
      );
    })
  }

  //shows an edit button when current loggedin user is the author of the respective post
  showEdit(post) {
    try {
      console.log(this.state.currentUser.username)
      if (this.state.currentUser._id === post.author) {
        console.log("Got here")
        return (
          <td><button className="button"><Link to={"/edit/" + post._id} className="link">edit</Link></button></td>
        )
      }
    } catch (err) { }
  }

  //shows a delete button when current loggedin user is the author of the respective post
  showDelete(post) {
    try {
      if (this.state.currentUser._id === post.author) {
        return (
          <td><button className="deleteButton" onClick={() => { this.deletePost(post._id) }}>delete</button></td>
        )
      }
    } catch (err) { }
  }

  deletePost(id) {
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
