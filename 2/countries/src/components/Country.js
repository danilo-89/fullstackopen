import React from 'react'

const Country = (props) => {
    return (
        <>
            <h2>{props.name}</h2>
            <p>Capital: {props.capital}</p>
            <p>Population: {props.population}</p>
            <h3>Languages</h3>
            <ul>
                {props.languages.map((lang) => {
                    return <li key={lang.name}>{lang.name}</li>
                })}
            </ul>
            <img
                src={props.flag}
                alt={props.name + " flag"}
                style={{
                    width:"100%",
                    maxWidth: "400px"
                }}
            />
        </>
    );
}

export default Country;