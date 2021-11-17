import React from "react";
import { Link } from 'react-router-dom';

const Comment = props => {
  const { _id, author, username, content, createdAt } = props.comment

  return (
    <React.Fragment key={_id}>
      <tbody className="card">
        <tr>
          <td>
            <Link className="user" to={"/user/" + author}>{username}</Link>
            <span className="time"> | ({createdAt === ("just now") ? "just now" : (createdAt.substring(0, 10) + " " + createdAt.substring(11, 19))})</span>
          </td>
        </tr>
        <tr><td>{content}</td></tr>
      </tbody>
    </React.Fragment>
  )
}

export default Comment