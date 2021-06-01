import React from 'react-dom';

const Person = ({ person }) => {
    return ( 
      <p>{person.name} {person.number}</p>
    );
}

export default Person