const express = require('express')
const morgan = require('morgan')

const app = express()

const requestLogger = (tokens, req, res) => {
  console.log(req.body)
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}

app.use(morgan(requestLogger));

app.use(express.json())


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
app.get("/api/persons", (req, res) => {
  res.json(persons)
})
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = (persons.find(person => person.id === id))
  if (person) {
    res.json(person)
  }
  if (!person) {
    res.status(404).end()
  }
})
app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})
app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: "content missing" })
  }
  const match = persons.find(p => p.name === body.name)

  if (match) {
    return res.status(409).json({ error: "name already exist in the server" })
  }

  if (!body.number) {
    return res.status(400).json({ error: "number missing" })
  }
  const person = {
    id: Math.floor(Math.random() * 10000000000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})