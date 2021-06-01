import React, { useState } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('Martin Fowler')
  const [newNumber, setNewNumber] = useState('39-54646-454')
  const [searchName, setSearchName] = useState('')

  const addName = (event) => {
    event.preventDefault();
    if (persons.filter((person) => person.name === newName).length) {
      alert(newName + " is already added to phonebook")
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObj));
      setNewName('');
      setNewNumber('');
    }
  }

  const handleNewNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }
  const handleNewNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  }
  const handleSearchNameChange = (event) => {
    console.log(event.target.value);
    setSearchName(event.target.value);
  }

  const showPersons = searchName.trim() ? persons.filter((person) => new RegExp(searchName, "gi").test(person.name)) : persons;

  return (
    <div>

      <h2>Phonebook</h2>

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
      { showPersons.length ? <>
          {showPersons.map((person) => {
            return <Person key={person.name} person={person} />
          })}
        </> :
        <p>No results for term "{searchName}"</p>
      }

    </div>
  )
}

export default App