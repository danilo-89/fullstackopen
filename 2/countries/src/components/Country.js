import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = (props) => {

    const [weather, setWeather] = useState(null)
    const api_key = process.env.REACT_APP_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${props.latlng[0]}&lon=${props.latlng[1]}&units=metric&exclude=hourly,daily&appid=${api_key}`

    const hook = () => {
        axios
            .get(url)
            .then(response => {
                console.log('promise weather fulfilled')
                console.log(response.data)
                setWeather(response.data)
            })
    }

    useEffect(hook, [api_key, url])


    return (
        <>
            <h2>{props.name}</h2>
            <p>Capital: {props.capital}</p>
            <p>Population: {props.population}</p>
            <h3>Spoken languages</h3>
            <ul>
                {props.languages.map((lang) => {
                    return <li key={lang.name}>{lang.name}</li>
                })}
            </ul>
            <img
                src={props.flag}
                alt={props.name + " flag"}
                style={{
                    width: "100%",
                    maxWidth: "400px"
                }}
            />
            {weather &&  
                <>
                    <h3>Weather in {props.capital}</h3>
                    <p><b>temperature:</b> {weather.current.temp} °C</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt="" />
                    <p><b>wind:</b> {weather.current.wind_speed} mph</p>
                </>
            }
           

        </>
    );
}

export default Country;