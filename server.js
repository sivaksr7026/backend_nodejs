const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const teacherRoutes = require('./routes/teacherRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors({origin:"*"}))
// mongodb connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully')
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

// routes
app.use('/teachers', teacherRoutes)
// server


app.get('/', (req, res) => {
  res.send('Server is running')
})
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
