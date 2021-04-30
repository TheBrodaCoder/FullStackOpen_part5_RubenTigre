describe('Blog app login form test', function() {
    beforeEach( function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        cy.request('POST', 'http://localhost:3001/api/users', {
            "username": "test",
            "name": "test name",
            "password": "test password"
         })
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('username:')
        cy.contains('password:')
        cy.get('#loginSubmit')
    })

    describe('Login', function() {
        beforeEach(function(){
            window.localStorage.removeItem('loggedBlogappUser')
        })

        it('Login works', function() {
            cy.get('#username').type('test')
            cy.get('#password').type('test password')
            cy.get('#loginSubmit').click()
            cy.contains('test name is connected')
        })

        it('Login fails', function() {
            cy.get('#username').type('error')
            cy.get('#password').type('error password')
            cy.get('#loginSubmit').click()
            cy.get('.Notification-block').contains('Wrong username or password')
            cy.get('.Notification-text').should('have.css', 'color', 'rgb(255, 0, 0)')
            cy.get('.Notification-block').should('have.css', 'background-color', 'rgb(253, 129, 129)')
        })
    })

    describe('Only logged users can write blogs', function() {
        beforeEach(function() {
            cy.visit('http://localhost:3000')
            cy.get('#username').type('test')
            cy.get('#password').type('test password')
            cy.get('#loginSubmit').click()
        })
        it('Can create a blog', function() {
            cy.get('#addBlog-button').click()
            cy.get('#title-input').type('A new test blog')
            cy.get('#author-input').type('test author')
            cy.get('#url-input').type('www.test.url')
            cy.get('#submit').click()
            cy.visit('http://localhost:3000')
            cy.contains('A new test blog')
        })
        it('Can like a blog', function() {
            cy.get('#addBlog-button').click()
            cy.get('#title-input').type('A new test blog')
            cy.get('#author-input').type('test author')
            cy.get('#url-input').type('www.test.url')
            cy.get('#submit').click()
            cy.visit('http://localhost:3000')
            cy.contains('A new test blog')
            cy.get('.more').click()
            cy.contains('likes: 0')
            cy.get('#vote').click()
            cy.contains('likes: 1')
        })
        it('Can delete a blog', function() {
            cy.get('#addBlog-button').click()
            cy.get('#title-input').type('A new test blog')
            cy.get('#author-input').type('test author')
            cy.get('#url-input').type('www.test.url')
            cy.get('#submit').click()
            cy.visit('http://localhost:3000')
            cy.contains('A new test blog')
            cy.get('.more').click()
            cy.get('#delete').click()
        })
        it('Other user cannot delete your blogs', function(){
            cy.get('#addBlog-button').click()
            cy.get('#title-input').type('A new test blog')
            cy.get('#author-input').type('test author')
            cy.get('#url-input').type('www.test.url')
            cy.get('#submit').click()
            cy.get('#logout-button').click()
            cy.request('POST', 'http://localhost:3001/api/users', {
                "username": "test1",
                "name": "test name1",
                "password": "test password1"
            })
            cy.get('#username').type('1')
            cy.get('#password').type('1')
            cy.get('#loginSubmit').click()
            cy.get('.more').click()
            cy.get('#delete').click()
            cy.contains('You dont had permission to delete this')
        })
        it.only('Blogs are listed by likes', function(){
            const blogsArray = [
                {
                  title: 'title 2',
                  author: 'author1',
                  url: 'testurl1',
                  likes: 20,
                },
                {
                  title: 'title 3',
                  author: 'author2',
                  url: 'testurl2',
                  likes: 15,
                },
                {
                  title: 'title 1',
                  author: 'author3',
                  url: 'testurl3',
                  likes: 30,
                }
            ]
            cy.request('POST', 'http://localhost:3001/api/login', { username: 'test', password: 'test password'})
                .then(response => {
                    cy.request({
                        method: 'POST',
                        url: 'http://localhost:3001/api/blogs',
                        body: blogsArray[0],
                        headers: {
                            'Authorization': `bearer ${response.body.token}`
                          }
                    })

                    cy.request({
                        method: 'POST',
                        url: 'http://localhost:3001/api/blogs',
                        body: blogsArray[1],
                        headers: {
                            'Authorization': `bearer ${response.body.token}`
                          }
                    })

                    cy.request({
                        method: 'POST',
                        url: 'http://localhost:3001/api/blogs',
                        body: blogsArray[2],
                        headers: {
                            'Authorization': `bearer ${response.body.token}`
                          }
                    })
                })

                cy.get('#logout-button').click()
                cy.get('#loginSubmit').click()
                cy.get('.more').click({multiple: true})
                cy.get('.bloglist_container').first().contains('likes: 30')
        })
    }) 
    
})



