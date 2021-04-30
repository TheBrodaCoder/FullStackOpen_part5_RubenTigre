const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require ('../models/user')

usersRouter.post('/users', async (request, response) => {
    const body = request.body
    
    if (body) {
        if (body.username && body.name && body.password) {
            if (body.username.length > 3 && body.password.length > 3 ) {
                const saltRounds = 10
                const passwordHash = await bcrypt.hash(body.password, saltRounds)

                const user = new User({
                    username: body.username,
                    name: body.name,
                    passwordHash
                })
                await user.save()
                response.status(201).json(user.toJSON)    
            } else {response.status(400).json({error: 'username or password length is less than three'})}
            
        } else {response.status(400).json({error: 'malformatted object'})}
          
    } else {response.status(400).json({error: 'Bad request body is not defined'})}
})

usersRouter.get('/users', async (request, response) => {
    const userList = await User.find({})
    response.json(userList)
})

usersRouter.get('/users/:id', async (request, response) => {
    if(request.params.id) {
        const user = User.findById(request.params.id)
        response.status(200).json(user)
    } else {response.status(400).json({error: 'Bad request missing id param'})}
})

usersRouter.put('/users/:id', async (request, response) => {
    const body = request.body
    const id = request.params.id
    if (body && id) {

        const idUser = await User.findById(id)
        
        const user = {
            username: body.username || idUser.username,
            name: body.name || idUser.name,
            passwordHash: body.passwordHash || idUser.passwordHash 
        }

        if (request.body.username || request.body.name || request.body.passwordHash) {
              await User.findByIdAndUpdate(request.params.id, user)
              response.status(200).json(user)

          } else {response.status(400).json({error: 'Doesnt change any entry or no data is send'})}

    } else {response.status(400).json({error: 'Bad request body or id is not defined'})}

})

module.exports = usersRouter