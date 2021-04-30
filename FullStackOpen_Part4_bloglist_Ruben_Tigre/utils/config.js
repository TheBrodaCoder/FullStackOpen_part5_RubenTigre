require('dotenv').config();

const PORT = process.env.PORT
const mongoUrl = process.env.mongoUrl
const SECRET = process.env.SECRET

module.exports = {
    PORT,
    mongoUrl,
    SECRET
}
