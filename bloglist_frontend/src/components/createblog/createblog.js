import React, { useState } from 'react'
import Notification from '../notification/Notification'

const Createblog = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [noti, setNoti] = useState({
    msj: 'Default msg',
    display: false,
    error: false
  })

  const handleCreate = async (evt) => {
    evt.preventDefault()

    try {
      addBlog({ title: title, author: author, url: url })
      handleNoti('Blog added succesful', false)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      handleNoti('Error while adding blog', true)
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

  return (
    <>
      <Notification noti={noti}/>
      <form onSubmit={handleCreate} id='form'>
            Title: <input type='text' onChange={(evt) => setTitle(evt.target.value)} value={title} id='title-input' name='title' placeholder='title'/><br/>
            Author: <input type='text' onChange={(evt) => setAuthor(evt.target.value)} value={author} id='author-input' name='author' placeholder='author'/><br/>
            Url: <input type='text' onChange={(evt) => setUrl(evt.target.value)} value={url} id='url-input' name='url' placeholder='url'/><br/>
        <input type='submit' id='submit'/>
      </form>
    </>
  )
}

export default Createblog
