const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        year: { type: String, required: true },
        major: { type: String, required: true },
        about: { type: String, required: true }
    }
)

module.exports = mongoose.model('users', User)