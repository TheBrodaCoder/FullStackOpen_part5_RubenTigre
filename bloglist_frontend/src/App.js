import React, { useState, useEffect, useRef } from 'react'
import Bloglist from './components/bloglist/bloglist'
import userservice from './service/userservice'
import blogservice from './service/blogservice'
import Notification from './components/notification/Notification'
import Login from './components/login/login'
import Createblog from './components/createblog/createblog'
import Toggable from './components/utilComponents/Toggable'

function App() {

  const [token, setToken] = useState(null)
  const [user, setUser] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const createRef = useRef()
  const [noti, setNoti] = useState({
    msj: 'Default msg',
    display: false,
    error: false
  })

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      blogservice.setToken(user.token)
      setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const formData = {
      username: username,
      password: password
    }

    try {
      const resp = await userservice.passLogin(formData)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(resp))
      setToken(resp.token)
      blogservice.setToken(resp.token)
      setUser(resp)
    } catch (error) {
      handleNoti('Wrong username or password', true)
    }

  }

  const handleNoti = (msj, error) => {
    let newNoti = {
      msj: msj,
      display: true,
      error: error
    }
    setNoti(newNoti)

    setTimeout(() => {
      setNoti({
        msj: 'Default msg',
        display: false,
        error: false
      })
    }, 3000)
  }

  const handleChange = (evt) => {
    evt.target.name === 'username' ?
      setUsername(evt.target.value)
      :
      setPassword(evt.target.value)
  }

  const handleLogOut = (evt) => {
    evt.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setToken(null)
  }

  const addBlog = async (blog) => {
    return await blogservice.createBlog({ title: blog.title, author: blog.author, url: blog.url })
  }

  const createForm = () => (
    <Toggable label='New Blog' ref={createRef} buttonName={'addBlog-button'}>
      <Createblog addBlog={addBlog} />
    </Toggable>
  )





  return (
    token === null ?
      (<div className='form-container'>
        <Notification noti={noti}/>
        <Login handleSubmit={handleSubmit} handleChange={handleChange} username={username} password={password}/>
      </div>)
      :
      (<div>
        <div className='user-data'>
          <Notification noti={noti}/>
          {user.name} is connected <br/>
          <button onClick={handleLogOut} id='logout-button'>Log out</button>
          <br/>
          <br/>
          {createForm()}

        </div>
        <br/>
        <Bloglist/>
      </div>)
  )
}

export default App
