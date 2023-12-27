import React from 'react-dom';

const Person = ({ person, handleDelete }) => {
    return ( 
      <p>
        <span>{person.name} {person.number}</span>
        <button onClick={() => handleDelete(person.id)}>delete</button>
      </p>
    );
}

export default Person