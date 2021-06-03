import React from 'react'

const PersonForm = (props) => {

    return (
        <form onSubmit={props.addName}>
            <div>
                name: <input onChange={props.handleNewNameChange} value={props.newName} />
            </div>
            <div>
                number: <input onChange={props.handleNewNumberChange} value={props.newNumber} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
}

export default PersonForm;

