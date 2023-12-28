const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
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

// API Endpoints
app.get('/info', async (request, response) => {
	const totalEntries = await Person.estimatedDocumentCount();
	const dateNow = new Date();

	response.send(`<p>
  Phonebook has info for ${totalEntries} people
  <br/>
  ${dateNow.toString()}
  </p>`);
});

app.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then((persons) => {
			response.json(persons);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post('/api/persons', async (request, response, next) => {
	const content = request.body;

	const personData = {
		name: content.name,
		number: content.number,
	};

	const isExistingPerson = await Person.exists({ name: content.name });

	if (isExistingPerson) {
		return next({
			name: 'custom.nameNotUnique',
			message: 'name must be unique',
		});
	}

	Person.create(personData)
		.then((result) => {
			response.json(result);
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const content = request.body;

	const personData = {
		name: content.name,
		number: content.number,
	};

	Person.findByIdAndUpdate(request.params.id, personData, {
		new: true,
		runValidators: true,
		context: 'query',
	})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

// Handler of requests with result to errors
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (
		error.name === 'ValidationError' ||
		error.name === 'custom.nameNotUnique'
	) {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);

// Configure and Start the Server
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
