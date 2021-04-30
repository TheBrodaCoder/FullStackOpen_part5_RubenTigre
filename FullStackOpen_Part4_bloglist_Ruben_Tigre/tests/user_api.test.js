const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const initialUsers = [
    {
        username: 'megatigre2030',
        name: 'Ruben Alejandro Tigre Rengel',
        passwordHash: '$2a$10$wDQda3tO//MlSfwN5xS6F.X38G/LXLDB1a7KOQo8TVpsLQOcvcNuR'
    },
    {
        username: 'slaso',
        name: 'Silvia Laso Trueba',
        passwordHash: '$2a$10$wDQda3tO//MlSfwN5xS6F.X38G/LXLDB1a7KOQo8TVpsLQOcvcNuS'
    }
  ]

beforeEach( async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    userObject = new User(initialUsers[1])
    await userObject.save()
})

const api = supertest(app)

test('users are returned as json without passwordHash', async () => {
    const users = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    expect(users.body[0].passwordHash === undefined).toBe(true)
})

test('added users required to had name and password', async () => {
    const saving = await api
        .post('/api/users')
        .send({name: 'papanatas'})
        .expect(400)

    expect(saving.body.error).toBe('malformatted object')
})

test('added users are added properly', async () => {
    const newUser = await api
        .post('/api/users')
        .send({
            username: 'papanatas',
            name: 'papanatas',
            password: 'papanatas'
        })
        .expect(201)

    const users = await api
        .get('/api/users')
        .expect(200)

    expect(users.body.some(user => user.username === 'papanatas')).toBe(true)

})





afterAll(() => {
    mongoose.connection.close()
})
