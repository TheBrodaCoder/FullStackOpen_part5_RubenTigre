const jwt = require('jsonwebtoken')
const {SECRET} = require('../utils/config')

const tokenExtractor = async (request, response, next) => {
    
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

        request.token = authorization.substring(7)

        request.decodedToken = await jwt.verify(request.token, SECRET)
    }

    next()
}

module.exports = tokenExtractor