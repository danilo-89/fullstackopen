const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

// Custom format function for Morgan
const morganConfig = (tokens, req, res) => {
	const body = req.method === 'POST' ? JSON.stringify(req.body) : '';

	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'),
		'-',
		tokens['response-time'](req, res),
		'ms',
		body,
	].join(' ');
};

app.use(morgan(morganConfig));

// Utils
const generateId = () => {
	return Math.floor(Math.random() * 999999999999999);
};

// Data
let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

// API Endpoints
app.get('/info', (request, response) => {
	const totalEntries = persons.length;
	const dateNow = new Date();

	response.send(`<p>
  Phonebook has info for ${totalEntries} people
  <br/>
  ${dateNow.toString()}
  </p>`);
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((item) => item.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((item) => item.id !== id);

	response.status(204).end();
});

app.post('/api/persons', (request, response) => {
	const content = request.body;

	if (!content) {
		return response.status(400).json({
			error: 'content missing',
		});
	}

	if (!content.name || !content.number) {
		return response.status(400).json({
			error: 'name or number missing',
		});
	}

	if (persons.findIndex((item) => item.name === content.name) > -1) {
		return response.status(400).json({
			error: 'name must be unique',
		});
	}

	const person = {
		name: content.name,
		number: content.number,
		id: generateId(),
	};

	persons = persons.concat(person);

	response.json(person);
});

// Configure and Start the Server
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
