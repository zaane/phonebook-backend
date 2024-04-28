require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('content', request => JSON.stringify(request.body))

const requestLogger = morgan((tokens, req, res) => {
    const format = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ]

    if (req.method === 'POST') format.push(tokens['content'](req, res))
    return format.join(' ')
})

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>welcome to da home page</h1>')
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(
        `<p>phonebook has info for ${`# OF PEOPLE HERE`} people</p>
         <p>${date.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(result => response.json(result))
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send({ error: 'person not found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name field empty'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number field empty'
        })
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: 'name already in phonebook'
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(result => {
            console.log(`${result.name} added to phonebook`)
            response.json(result)
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id '})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})