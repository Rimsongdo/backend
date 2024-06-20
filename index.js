const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.send(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.get('/infos', (req, res) => {
    const now = new Date();
    const htmlResponse = `
        <html>
            <body>             
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${now}</p>
            </body>
        </html>
    `;
    res.send(htmlResponse);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    const nameExists = persons.some(person => person.name === name);

    if (nameExists) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 100),
        name: name,
        number: number
    };

    persons = persons.concat(newPerson);

    res.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

