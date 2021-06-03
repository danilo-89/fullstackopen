import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Martin Fowler')
  const [newNumber, setNewNumber] = useState('39-54646-454')
  const [searchName, setSearchName] = useState('')


  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  useEffect(hook, [])

  console.log(persons)

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
    setNewName(event.target.value);
  }
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  }
  const handleSearchNameChange = (event) => {
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
        <p>No results for the term "{searchName}"</p>
      }

    </div>
  )
}

export default App