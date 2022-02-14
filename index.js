require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const Person = require('./models/person')

morgan.token('body', function getBody (req) {
  if(req.method && req.method === 'POST')
    return JSON.stringify(req.body)
  return null
})

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
      mongoose.connection.close()
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(p => {
      res.json(p)
      mongoose.connection.close()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'data missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)

    mongoose.connection.close()
  })
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for N people</p><p>${new Date().toString()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
