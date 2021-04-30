const { set } = require("mongoose")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)

}

const favoriteBlog = (blogs) => {
    return blogs.find(blog => blog.likes === blogs.reduce((max, blog) => blog.likes > max ? blog.likes : max , 0))
}

const mostBlogs = (blogs) => {
    const authorsName = blogs.map(blog => blog.author)
    const authorMap = new Map()

    authorsName.map(author => {
        if (authorMap.has(author)) {
            const blogs = authorMap.get(author)
            authorMap.set(author, blogs + 1)

        } else {
            authorMap.set(author, 1)
        }
    })

    const author = Array.from(authorMap).find(author => author[1] === Array.from(authorMap).reduce((max, author) => author[1] > max ? author[1] : max , 0))

    return ({
        author: author[0],
        blogs: author[1]
    })
}

const mostLikes = (blogs) => {
    const authors = blogs.map(blog => [blog.author, blog.likes])
    const authorsMap = new Map()

    authors.map(author => {
        if (authorsMap.has(author[0])) {
            authorsMap.set(author[0], authorsMap.get(author[0]) + author[1])
        } else {
            authorsMap.set(author[0], author[1])
        }
    })
    
    const author = Array.from(authorsMap).find(author => author[1] === Array.from(authorsMap).reduce((max, author) => author[1] > max ? author[1] : max , 0))

    return ({
        author: author[0],
        likes: author[1]
        })
}



module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }