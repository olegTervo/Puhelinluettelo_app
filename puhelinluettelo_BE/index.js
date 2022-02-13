const express = require('express')
const morgan = require('morgan')

morgan.token('body', function getBody (req) {
  if(req.method && req.method === 'POST')
    return JSON.stringify(req.body)
  return null
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Margaret Sukunimi",
      "number": "044-12214444",
      "id": 3
    },
    {
      "name": "Kasandra",
      "number": "040-6661234",
      "id": 4
    }
  ];

const generateId = () => {
  let id = Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)

  while(persons.findIndex(p => p.id === id) !== -1) {
    id = Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)
  }

  return id;
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'data missing' 
    })
  }

  if (persons.findIndex(p => p.name === body.name) !== -1) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
