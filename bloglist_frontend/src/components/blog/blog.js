import React from 'react'
import propTypes from 'prop-types'
import Toggable from '../utilComponents/Toggable'

const Blog = (props) => {

  return (
    <div className='Blog-Container' style={{ border: '1px black solid', width: '30vw', padding: '0.2vw', marginBottom: '0.4vw' }}>
        Title: {props.title}
      <br/>
        Author: {props.author}
      <Toggable label='more' buttonName='more'>
        <p style={{ margin: '0', marginBlockStart: '0' }}>
          <br/>
          url: {props.url}
          <br/>
          likes: {props.likes}
          <br/>
        </p>
        <button onClick={props.handleVote} id='vote'>vote</button>
        <button onClick={props.handleDelete} id='delete'>delete</button>
      </Toggable>
    </div>
  )
}

Blog.propTypes = {
  author: propTypes.string.isRequired,
  url: propTypes.string.isRequired,
  likes: propTypes.number.isRequired,
  handleVote: propTypes.func.isRequired,
  handleDelete: propTypes.func.isRequired
}

export default Blog