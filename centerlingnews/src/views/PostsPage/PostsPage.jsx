import React from "react";
import { Link } from 'react-router-dom';

import "./PostsPage.scss";

class PostsPage extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      posts: []
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
          </tr>
          <tr></tr>
        </React.Fragment>
      );
    })
  }

  componentDidMount() {
    const API_URL = process.env.REACT_APP_API_HOST + "/api";
    const endpoint = API_URL + "/posts"; // 'api/posts

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

  render() {
    console.log(this.state.posts)
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
