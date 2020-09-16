const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 8000

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const userRouter = require('./routes/user')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(userRouter)

app.listen(port, () => console.log(`Server running on port ${port}`))