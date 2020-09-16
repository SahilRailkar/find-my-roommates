const User = require('../models/user')

createUser = (req, res) => {
    const body = req.body

    console.log(req.body)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide user information'
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all required user information'
        })
    }

    user.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User created!',
            })
        })
        .catch(err => {
            return res.status(400).json({
                err,
                message: 'User not created',
            })
        })
}

module.exports = {
    createUser
}