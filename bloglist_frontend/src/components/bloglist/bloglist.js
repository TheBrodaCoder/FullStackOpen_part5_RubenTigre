import React, { useState, useEffect } from 'react'
import Blog from '../blog/blog'
import Loader from '../loader/loader'
import blogservice from '../../service/blogservice'
import Notification from '../notification/Notification'

const Bloglist = () => {
  const [blogArray, setBlogArray] = useState([])
  const [loading, setLoading] = useState(false)
  const [noti, setNoti] = useState({
    msj: 'Default msg',
    display: false,
    error: false
  })
  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const resp = await blogservice.getAllBlogs()
      resp.sort((a, b) => {
        return b.likes - a.likes
      })
      setBlogArray(resp)
      setLoading(true)

    } catch (error) {
      setLoading(false)
      setBlogArray([])
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

  const handleVote = async (id) => {
    const targetBlog = await blogservice.getThatBlog(id)

    if (targetBlog) {
      const updatedBlog = { ...targetBlog, likes: targetBlog.likes + 1 }
      await blogservice.updateBlog(id, updatedBlog)

      const target = blogArray.findIndex(blog => blog.id === id)
      const newArray = [...blogArray]
      newArray[target] = { ...newArray[target], likes: updatedBlog.likes }
      newArray.sort((a, b) => {
        return b.likes - a.likes
      })
      setBlogArray(newArray)
    }
  }

  const handleDelete = async (id) => {
    const target = blogArray.find(blog => blog.id === id)
    const confirm = window.confirm(`Remove blog: ${target.title}`)

    if (target) {
      if (confirm) {
        try {
          await blogservice.deleteBlog(id)
          setBlogArray(blogArray.filter(blog => blog.id !== id))
        } catch (error) {
          handleNoti('You dont had permission to delete this', true)
        }
      }
    }
  }


  return (
    <div className='bloglist_container'>
      {
        loading ? (
          <div>
            <Notification noti={noti}/>
            {blogArray.map(blog => {
              return (
                <Blog
                  key={blog.id}
                  title={blog.title}
                  author={blog.author}
                  url={blog.url}
                  likes={blog.likes}
                  user={blog.user.username}
                  handleVote={() => {handleVote(blog.id)}}
                  handleDelete={() => {handleDelete(blog.id)}}
                />
              )})}
          </div>
        ) : (
          <Loader/>
        )
      }
    </div>
  )
}

export default Bloglist