const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET } = require('../utils/config')

loginRouter.post('/login', async (request, response) => {
    
    const body = request.body


    if (body) {

        const user = await User.findOne({username: body.username})
        const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

        if (user !== null) {
            if (passwordCorrect) {
                const userForToken = {
                    username: user.username,
                    id: user._id
                }

                const token = jwt.sign(userForToken, SECRET) // returns the token only if there is

                response.status(200).send({token, username: user.username, name: user.name})
                
            } else { return response.status(400).json({error: 'password is not correct'}) } //when the password is not correct

        } else { return response.status(400).json({error: 'that username didnt exist'}) } //when the username is not defined on the db

    } else { return response.status(400).json({error: 'Bad request. Body is not defined'}) } //When body is not defined.


})

module.exports = loginRouter
