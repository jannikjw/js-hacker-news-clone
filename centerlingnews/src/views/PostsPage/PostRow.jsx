import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { authHeader } from "../../helpers";

const API_URL = process.env.REACT_APP_API_HOST + "/api";


class PostRow extends Component {
  constructor(props) {
    super(props)

    this.isAuthor = this.isAuthor.bind(this)

    function isVoted(post, userID) {
      return post.upvoters.includes(userID)
    }

    this.state = {
      isVoted: isVoted(this.props.post, this.props.userID),
      upvoteCount: this.props.post.upvoters.length
    }
  }

  isAuthor(author) {
    return this.props.userID === author
  }

  //shows a delete button when current loggedin user is the author of the respective post
  showDelete(post) {
    try {
      if (this.props.userID === post.author) {
        return (
          <button className="deleteButton" onClick={() => { this.deletePost(post._id) }}>delete</button>
        )
      }
    } catch (err) { }
  }

  //Deletes post in backend and frontend separately to avoid reloading
  deletePost(id) {
    const endpoint = API_URL + "/posts"; // 'api/posts

    const requestOptions = {
      method: "DELETE",
      headers: authHeader(),
    };

    fetch(endpoint + "/" + id, requestOptions)
      .then(response => { console.log(response.data) });

    this.props.deletePost(id)
  }

  votePost() {
    //if users are not logged in but try to vote they are redirected to login page
    const userID = this.props.userID
    const isVoted = this.state.isVoted
    const postID = this.props.post._id

    // console.log("User: " + this.state.currentUser.username)
    if (!userID) {
      window.location = '/login'
    } else {

      const endpoint = API_URL + "/posts"; // 'api/posts
      const requestOptions = {
        method: "PUT",
        headers: authHeader(),
      };

      try {
        if (isVoted) {
          //Vote has been voted up yet --> unvote
          fetch(endpoint + "/" + postID + "/unvote/" + userID, requestOptions)
            .then(res => res.ok && this.setState({ isVoted: false, upvoteCount: this.state.upvoteCount - 1 }))
        } else {
          //Vote has been not voted up yet --> vote up
          fetch(endpoint + "/" + postID + "/upvote/" + userID, requestOptions)
            .then(res => res.ok && this.setState({ isVoted: true, upvoteCount: this.state.upvoteCount + 1 }))
        }
      } catch (err) {
        console.error(err)
      }
    }


  }

  render() {
    const { post, index } = this.props
    const { _id, url, title, author, username, comments } = this.props.post
    const { upvoteCount, isVoted } = this.state

    let hostName = new URL(url).hostname;
    hostName = hostName.replace('www.', '');

    return (
      <React.Fragment key={_id}>
        <tr>
          <td className="index">{index + 1}</td>
          <td className="title">
            <a href={url} rel="noopener noreferrer" target="_blank" className="title">{title}</a>
            <span className="url"> (<a href={url} rel="noopener noreferrer" target="blank"><span>{hostName}</span></a>)</span>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            {upvoteCount} votes by
            <Link className="user" to={"/user/" + author}> {username}</Link>
          </td>
          <td>{this.isAuthor(author) && <button><Link to={"/edit/" + _id} className="link">edit</Link></button>}</td>
          <td>{this.showDelete(post)}</td>
          <td><button onClick={() => { this.votePost(_id) }}>{isVoted ? "unvote" : "vote"}</button></td>
          <td>
            <Link to={"/posts/" + _id}>
              {comments.length + " " + (comments.length > 1 ? "comments" : "comment")}
            </Link>
          </td>
        </tr>
      </React.Fragment>
    )
  }
}

export default PostRow