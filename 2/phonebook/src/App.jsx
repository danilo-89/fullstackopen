import React, { useState, useEffect } from 'react';
import Person from './components/Person';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';
import mainService from './services/Main';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('Martin Fowler');
	const [newNumber, setNewNumber] = useState('39-54646-454');
	const [searchName, setSearchName] = useState('');
	const [statusMessage, setStatusMessage] = useState([null, null]);

	const hook = () => {
		mainService.getAll().then((result) => {
			console.log('promise fulfilled');
			setPersons(result);
		});
	};

	useEffect(hook, []);

	console.log(persons);

	const addName = (event) => {
		event.preventDefault();
		if (newName.trim()) {
			const personObj = {
				name: newName,
				number: newNumber,
			};
			const isAlreadyThere = persons.filter(
				(person) => person.name === newName
			);
			// Check if there is already that person in phonebook
			if (isAlreadyThere.length) {
				console.log('duplicate found');
				if (
					window.confirm(
						newName +
							' is already in the phonebook, replace old number with the new one?'
					)
				) {
					mainService
						.update(isAlreadyThere[0].id, personObj)
						.then((result) => {
							console.log(result);
							const personsUpdated = persons.map((person) =>
								person.id === isAlreadyThere[0].id
									? { ...personObj, id: person.id }
									: person
							);
							setPersons(personsUpdated);
							setStatusMessage(['Updated ' + newName, 'success']);
							setNewName('');
							setNewNumber('');
							setTimeout(() => {
								setStatusMessage([null, null]);
							}, 4000);
						})
						.catch((error) => {
							console.log(error);
							setStatusMessage([error.response.data.error, 'error']);
							const personsUpdated = persons.filter(
								(person) => person.id !== isAlreadyThere[0].id
							);
							setPersons(personsUpdated);
							setTimeout(() => {
								setStatusMessage([null, null]);
							}, 4000);
						});
				}
				// If not, add it to phonebook
			} else {
				console.log('no duplicate, proceed with adding');
				mainService
					.create(personObj)
					.then((result) => {
						setPersons(persons.concat(result));
						setStatusMessage(['Added ' + newName, 'success']);
						setNewName('');
						setNewNumber('');
						setTimeout(() => {
							setStatusMessage([null, null]);
						}, 4000);
					})
					.catch((error) => {
						console.log(error);
						setStatusMessage([error.response.data.error, 'error']);
						setTimeout(() => {
							setStatusMessage([null, null]);
						}, 4000);
					});
			}
		} else {
			setStatusMessage(['No empty names allowed', 'error']);

			setTimeout(() => {
				setStatusMessage([null, null]);
			}, 4000);
		}
	};

	const handleNewNameChange = (event) => {
		setNewName(event.target.value);
	};
	const handleNewNumberChange = (event) => {
		setNewNumber(event.target.value);
	};
	const handleSearchNameChange = (event) => {
		setSearchName(event.target.value);
	};
	const handleDelete = (id) => {
		if (window.confirm('Do you really want to delete this person?')) {
			mainService
				.remove(id)
				.then((result) => {
					console.log(result);
					const personsUpdated = persons.filter((person) => person.id !== id);
					setPersons(personsUpdated);
				})
				.catch((error) => {
					console.log(error);
					setStatusMessage(['Something is wrong', 'error']);
					setTimeout(() => {
						setStatusMessage([null, null]);
					}, 4000);
				});
		}
	};

	const showPersons = searchName.trim()
		? persons.filter((person) => new RegExp(searchName, 'gi').test(person.name))
		: persons;

	return (
		<div>
			<h2>Phonebook</h2>
			{statusMessage[0] && (
				<Notification message={statusMessage[0]} status={statusMessage[1]} />
			)}
			<Filter
				handleSearchNameChange={handleSearchNameChange}
				searchName={searchName}
			/>

			<h2>add a new</h2>
			<PersonForm
				addName={addName}
				newName={newName}
				newNumber={newNumber}
				handleNewNameChange={handleNewNameChange}
				handleNewNumberChange={handleNewNumberChange}
			/>

			<h2>Numbers</h2>
			{showPersons.length ? (
				<>
					{showPersons.map((person) => {
						return (
							<Person
								key={person.id}
								person={person}
								handleDelete={handleDelete}
							/>
						);
					})}
				</>
			) : (
				<p>No results for the term "{searchName}"</p>
			)}
		</div>
	);
};

export default App;
