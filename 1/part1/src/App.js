import React from 'react'

const Hello = (props) => {
  return ( 
    <div>
      <p>Hello {props.name || "test"}, you are {props.age || 0} years old</p>
    </div>
  );
}

const Footer = () => {
  return ( 
    <div>
      greeting app created by <a href="https://github.com/mluukkai">mluukkai</a>
    </div>
  );
}


const App = () => {

  return (
    <>
    <h1>Greetings</h1>
    <Hello name='George' age={45 - 15} />
    <Footer />
    </>
    )
  
}

export default App