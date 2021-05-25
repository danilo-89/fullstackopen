import React, { useState } from 'react'

const Button = ({ text, onClick }) => {
  return ( 
    <button onClick={onClick}>{text}</button>
   );
}

const Statistics = ({ text, value }) => {
  return ( 
    <tr><td>{text}</td><td>{value}</td></tr>
   );
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  // total clicks
  const total = good + neutral + bad

  return (
    <div>
      <h2>give feedback</h2>
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />
      <h2>statistics</h2>
      {(good || neutral || bad) ?
      <table>
        <tbody>
          <Statistics text="good" value={good}/>
          <Statistics text="neutral" value={neutral}/>
          <Statistics text="bad" value={bad}/>
          <Statistics text="all" value={total}/>
          <Statistics text="average" value={(good * 1 + bad * -1) / total}/>
          <Statistics text="positive" value={good / total * 100 + " %"}/>
        </tbody>
      </table> :
        <p>No feedback given</p>
      }

    </div>
  )
}

export default App