import React from 'react'

const Filter = (props) => {
    return ( 
        <div>
            filter shown with: <input type="search" onChange={props.handleSearchNameChange} value={props.searchName}/>
        </div>
    );
}

export default Filter;