const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const initialBlogs = [
    {
      title: "Entintado comics",
      author: "Silvia Laso",
      url: "entintadocomics.com",
      likes: 20,
      id: "607d484f708cad0aa0e4f891",
      user: "60808be263827321ece2d146"
    },
    {
      title: "El jardin de las musas",
      author: "Silvia Laso, Monica y otra más",
      url: "eljardindelasmusas.com",
      likes: 10,
      id: "607ecd396020531b780286f2",
      user: "60808be263827321ece2d146"

    }
  ]

beforeEach( async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

const authGallo = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdhbGxvIiwiaWQiOiI2MDgxOTYxN2UyZDZhMTQ0M2M3ZDIxNWEiLCJpYXQiOjE2MTkxMDU4OTV9.VyYJkxxnv4J6VPtTc3f4D9UWS4CXc1sVqkQM0U3Q9KE'
const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs id are named as id instead _id', async () => {
    const blog = await api
        .get('/api/blogs')

    expect(blog.body[0].id).toBeDefined()
    expect(blog.body[0]._id === undefined).toBe(true)
})

test('blogs are created when POST request are made', async () => {
    const blog = {
        title: 'Ruben web',
        author: 'Ruben Tigre',
        url: 'www.tigre.com',
        likes: 30
    }

    const blogsBefore = await Blog.find({})
    await api
    .post('/api/blogs')
    .set('Authorization', authGallo)
    .send(blog)
    .expect(201)
    const blogsAfter = await Blog.find({})
    const addedBlog = await Blog.find({title: blog.title})

    expect(blogsBefore.length < blogsAfter.length).toBe(true)
    expect(addedBlog[0].title).toEqual(blog.title)
    expect(addedBlog[0].author).toEqual(blog.author)
    expect(addedBlog[0].url).toEqual(blog.url)
    expect(addedBlog[0].likes).toEqual(blog.likes)
    
})

test('blogs receive 401 if there is no token', async () => {
    const blog = {
        title: 'Ruben web',
        author: 'Ruben Tigre',
        url: 'www.tigre.com',
        likes: 30
    }

    await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)

    
})

test('blogs are saved with 0 likes as default', async () => {
    const blog = {
        title: 'Paquita salas',
        author: 'Los javis creo',
        url: 'www.paquita.com'
    }

    await api
    .post('/api/blogs')
    .set('Authorization', authGallo)
    .send(blog)
    .expect(201)

    const addedBlog = await Blog.find({title: blog.title})

    expect(addedBlog[0].likes).toBe(0)
})

test('blogs recive a 500 error when request has no title or author', async () => {
    const blogWithoutTitle = {
        author: 'Los javis creo',
        url: 'www.paquita.com',
        likes: 3
    }

    const blogWithoutAuthor = {
        title: 'Paquita salas',
        url: 'www.paquita.com',
        likes: 3
    }

    const blogWithoutBoth = {
        url: 'www.paquita.com',
        likes: 3
    }

    await api
    .post('/api/blogs')
    .set('Authorization', authGallo)
    .send(blogWithoutAuthor)
    .expect(500)

    await api
    .post('/api/blogs')
    .set('Authorization', authGallo)
    .send(blogWithoutTitle)
    .expect(500)

    await api
    .post('/api/blogs')
    .set('Authorization', authGallo)
    .send(blogWithoutBoth)
    .expect(500)
})

afterAll(() => {
    mongoose.connection.close()
})