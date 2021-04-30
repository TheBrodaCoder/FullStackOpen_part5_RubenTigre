const resetRouter = require('express').Router()
const Blog = require ('../models/blogs')
const User = require('../models/user')


resetRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = resetRouter