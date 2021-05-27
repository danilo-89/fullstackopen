import React, { useState } from 'react'

const Button = ({ text, onClick }) => {
  return ( 
    <button onClick={onClick}>{text}</button>
  );
}

const Anecdote = ({ text }) => {
  return ( 
    <p>{text}</p>
  );
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  // get random anecdote
  const randomAnecdote = () => {
    let randomNum = 0;
    do {
      randomNum =  Math.floor(Math.random() * (anecdotes.length));
    }
    while (selected ===randomNum);
    console.log(randomNum);
    setSelected(randomNum);
  }

  // vote
  const voteAnecdote = (num) => {
    const copy = [...points];
    copy[num] += 1;
    setPoints(copy);
    console.log(points);
  }

  // get max votes item index in array
  const getMax = () => {
    console.log("points max",points.indexOf(Math.max(...points)));
    return points.indexOf(Math.max(...points))
  }

  // check if there are no votes
  const checkIfNoVotes = () => {
    return points.every(element => element === 0);
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <Anecdote text={anecdotes[selected]} />
      <p>has {points[selected]} votes</p>
      <Button text={"vote"} onClick={() => voteAnecdote(selected)}/>
      <Button text={"next anecdote"} onClick={randomAnecdote}/>
      {checkIfNoVotes() ?
        <><h2>No votes yet</h2></> :
        <>
          <h2>Anecdote with most votes</h2>
          <Anecdote text={anecdotes[getMax()]} />
          <p>has {points[getMax()]} votes</p>
        </>
      }
    </div>
  )
}

export default App