import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Country from './components/Country'
import axios from 'axios'

function App() {
  console.log("render")
  const [newSearch, setNewSearch] = useState('')
  const [fetchedData, setfetchedData] = useState([])

  const hook = (url) => {
    axios
      .get(url)
      .then(response => {
        console.log('promise fulfilled')
        setfetchedData(response.data)
      })
  }

  useEffect(()=>{
    hook('https://restcountries.eu/rest/v2/all')
  }, [])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const showCountry = newSearch.trim()
    ? fetchedData.filter((country) => new RegExp(newSearch, "gi").test(country.name))
    : [];

  let countryElement;
  if (!fetchedData.length) {
    countryElement = <p>Please wait, data is loading...</p>
  } else if (showCountry.length > 10) {
    countryElement = <p>Too much results, be more specific</p>
  } else if (showCountry.length === 1) {
    countryElement = <Country
        key={showCountry[0].name}
        name={showCountry[0].name}
        capital={showCountry[0].capital}
        population={showCountry[0].population}
        languages={showCountry[0].languages}
        flag={showCountry[0].flag}
        latlng={showCountry[0].latlng}
      />
  } else if (showCountry.length > 1 && showCountry.length <= 10) {
    countryElement = showCountry.map((country) => {
      return (
        <div key={country.name}>
          <span>{country.name} </span>
          <button onClick={() => {setNewSearch(country.name)}}>Show</button>
          <hr />
        </div>
      )
    })
  } else if (newSearch && showCountry.length === 0) {
    countryElement = <p>No results for the search term: "{newSearch}"</p>
  } else if (!newSearch && showCountry.length === 0) {
    countryElement = <p>Type something in the search input</p>
  }

  return (
    <div className="App">
      <Search value={newSearch} onChange={handleSearchChange} />
      <br />
      <br />
      {countryElement}
    </div>
  );
}

export default App;