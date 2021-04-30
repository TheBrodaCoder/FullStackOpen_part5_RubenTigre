import React from 'react'
import propTypes from 'prop-types'

const Login = (props) => {

  return(

    <form onSubmit={props.handleSubmit}>
            username: <input type='text' onChange={props.handleChange} value={props.username} name='username' id='username'/>
      <br/>
            password: <input type='password' onChange={props.handleChange} value={props.password} name='password' id='password'/>
      <br/>
      <input type='submit' id='loginSubmit' value='Submit'/>
    </form>
  )
}

Login.propTypes = {
  handleChange: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
  password: propTypes.string.isRequired
}

export default Login