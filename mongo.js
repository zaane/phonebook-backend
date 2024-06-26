const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://zaneolds:${password}@cluster0.rfth34n.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const getPeople = () => {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}


if (process.argv.length === 3) {
    getPeople();
}

if (process.argv.length === 5) {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const newPerson = new Person({
        name: newName,
        number: newNumber
    })

    newPerson.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}