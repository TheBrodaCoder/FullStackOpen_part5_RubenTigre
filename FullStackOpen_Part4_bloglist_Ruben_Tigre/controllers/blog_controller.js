const blogRouter = require('express').Router()
const Blog = require ('../models/blogs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


blogRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})



blogRouter.post('/blogs',  async(request, response) => {
  const existBlog = await Blog.findOne({title: request.body.title})
  
  if (existBlog === null) {
    if (request.body.title && request.body.author
      && request.body.url) {
  

        if (!request.token || !request.decodedToken.id) {
          return response.status(401).json({error: "token missing or invalid"})
        }

        const user = await User.findById(request.decodedToken.id)

        const blog = new Blog({
          title: request.body.title,
          author: request.body.author,
          url: request.body.url,
          likes: request.body.likes || 0,
          user: user._id

        })

        await blog.save()
      
        response.status(201).json(blog.toJSON())
        
    } else {response.status(500).json({error: 'Title, author or url are not defined'})}
  } else {response.status(500).json({error: 'Bad request'})}
})

blogRouter.get('/blogs/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1})
  response.status(200).json(blog.toJSON())
})


blogRouter.delete('/blogs/:id', async (request, response) => {
  const exist = await Blog.findById(request.params.id)

  if (exist) {
    
    if (!request.token || !request.decodedToken) { return response.status(401).json({error: "token missing or invalid"})}

    const userId = await User.findById(request.decodedToken.id)


    if (userId._id.toString() !== exist.user.toString()) { return response.status(401).json({error: "User is not able to delete this blog"})}

    if (exist.user.toString())
    
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).json({error: 'delete sucesfull'})
  } else {response.status(404).json({error: 'Id doesnt exist'})}
})


blogRouter.put('/blogs/:id', async (request, response) => {
  const exist = await Blog.findById(request.params.id)

  if (exist) {
    const blog = {
      title: request.body.title || exist.title,
      author: request.body.author || exist.author,
      url: request.body.url || exist.url,
      likes: request.body.likes || exist
    }
    if (request.body.author || request.body.title || 
      request.body.url || request.body.likes) {
        await Blog.findByIdAndUpdate(request.params.id, blog)
        response.status(200).json(blog)

    } else {response.status(400).json({error: 'Doesnt change any entry or no data is send'})}

  } else {response.status(404).json({error: 'id doesnt exist'})}

})



module.exports = blogRouter