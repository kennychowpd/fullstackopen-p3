require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URL

if (process.argv.length < 4) {
  console.log('give both name and number as the third and the forth argument')
  process.exit(1)
}

const name = process.argv[2]
const number = process.argv[3]

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3 ) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

const person = new Person({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log(result)
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})