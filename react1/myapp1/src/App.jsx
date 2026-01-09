import { useState } from 'react'
import myappLogo from './assets/logo.png'

import './App.css'

function MyLogo() {
  return (
    <div >
    <img src={myappLogo} className="logo" alt="MyApp logo" />
     My First Demo react app
    </div>
  )
}

// A simple Button component with default props
function Button({ text = 'Click me', type = 'button' }) {
  return <button type={type}>{text}</button>;
}

// A component that adds 'a' to a string each time the button is clicked
// and displays the current string
function AddStuff() {
  const [items, addItems] = useState("a");
  return (
    <div>
      <button onClick={() => addItems(items + "a")}>Add 'a'</button>
      <p>{items}</p>
    </div>
  );
}

// A component that displays a list of items
function ListStuff() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );

}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MyLogo />
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
         <AddStuff/>
        </p>
      </div>
      These 2 buttons are using the Button component:
      <Button text="Custom Button" />
      <Button />
      <div>
          <h3>Showing a list</h3>
           <ListStuff />
      </div>
    </>
    
  )
}

export default App
