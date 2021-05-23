import React, { useState } from 'react'


// const Display = ({ counter }) => {
//   return (
//     <div>{counter}</div>
//   );
// }

// const Buttons = ({ handleClick, text }) => {
//   return (
//     <button onClick={handleClick}>
//       {text}
//     </button>
//   );
// }

// const App = () => {
//   const [counter, setCounter] = useState(0)

//   const increaseByOne = () => setCounter(counter + 1);
//   const decreaseByOne = () => setCounter(counter - 1);
//   const setToZero = () => setCounter(0);


//   console.log('rendering...', counter)

//   return (
//     <>
//       <Display counter={counter} />
//       <Buttons
//         handleClick={setToZero}
//         text='zero'
//       />
//       <Buttons
//         handleClick={increaseByOne}
//         text='plus'
//       />
//       <Buttons
//         handleClick={decreaseByOne}
//         text='minus'
//       />
//     </>
//   )
// }

// --------------------------------------------------------
// --------------------------------------------------------

// const History = (props) => {
//   if (props.allClicks.length < 1) {
//     return ( 
//       <div>
//         the app is used by clicking buttons
//       </div>
//      );
//   } else {
//     return ( 
//       <div>
//         Buttons press history :{props.allClicks.join(' ')}
//       </div>
//     )
//   }
// }

// const Button = (props) => {
//   console.log('props value is', props)

//   return (
//     <button onClick={props.onClick}>
//       {props.text}
//     </button>
//   )  
// }


// const App = () => {
//   const [left, setLeft] = useState(0)
//   const [right, setRight] = useState(0)
//   const [allClicks, setAll] = useState([])

//   const handleLeftClick = () => {
//     setAll(allClicks.concat('L'))
//     setLeft(left + 1)
//   }

//   const handleRightClick = () => {
//     setAll(allClicks.concat('R'))
//     setRight(right + 1)
//   }

//   return (
//     <div>
//       {left}
//       <Button onClick={handleLeftClick} text='left' />
//       <Button onClick={handleRightClick} text='right' />
//       {right}
//       <History allClicks={allClicks} />
//     </div>
//   )
// }

const Display = (props) => {
  return ( 
    <div>
      {props.value}
    </div>
  );
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  );
}

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text={"Button"}></Button>
    </div>
  )
}

export default App
