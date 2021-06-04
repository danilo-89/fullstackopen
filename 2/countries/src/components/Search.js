import React from 'react'

const Search = (props) => {
    return (
        <>
            <label htmlFor="searchInput">Find countries</label>
            <input
                type="search"
                value={props.value}
                onChange={props.onChange}
                id="searchInput"
                placeholder="E.g., Switzerland"
            />
        </>
    );
}

export default Search;