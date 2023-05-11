require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

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

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'malformatted id' })
  }
  next(err)
}

app.use(morgan(requestLogger));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    console.log(persons)
    res.json(persons)
  })
})

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  })
    .catch(err => next(err))
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  console.log(body)

  if (!body.name) {
    console.log("missing name")
    return res.status(400).json({ error: "content missing" })
  }

  if (!body.number) {
    console.log("missing number")
    return res.status(400).json({ error: "number missing" })
  }

  Person.findOne({ name: body.name })
    .then(result => {
      console.log("same name exists")
      res.status(409).json({ error: "name already exist in the server" })
    })

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => { res.json(updatedPerson) })
    .catch(err => next(err));
})


app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})