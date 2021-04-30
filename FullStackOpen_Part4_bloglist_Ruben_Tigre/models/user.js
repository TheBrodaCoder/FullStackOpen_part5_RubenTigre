const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 4,
        unique: true,
        required: true,
        validation: {
            validator: (strtotest) => {
                return /[A-Za-z0-9]{4,}/.test(strtotest)
            }
        }
    },
    name: {
        type: String,
        required: true,
        unique: false,
        validation: {
            validator: (strtotest) => {
                return /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/.test(strtotest)
            }
        }

    },
    passwordHash: {
        type: String,
        required: true,
        unique: false
    }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      //the passwordHas should not be revealed
      delete returnedObject.passwordHash
    }
  })


module.exports = mongoose.model('User', userSchema)