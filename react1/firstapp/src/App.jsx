import { useState } from 'react'
import myLogo from './assets/logo.png'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')

  function handleClick() {
    const trimmed = name.trim()
    if (trimmed.length === 0) {
      setGreeting('Hello! Please enter your name.')
    } else {
      setGreeting(`Hello, ${trimmed}!`)
    }
  }

  return (
    <>
      <div class="header">
        <header>
          <img style={{ display: 'inline' }} src={myLogo} className="logo" alt="Advanced Mobile Logo" />
          <h1 style={{ display: 'inline-block' }}>Hello World+</h1>
        </header>
      </div>
      <div>
        <label htmlFor="name">Enter your name:</label>
        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <button onClick={handleClick} style={{ marginLeft: 8, padding: '8px 12px', fontSize: '16px' }}>Click me!</button>
        </div>

        {greeting && (
          <div style={{ marginTop: 12, fontSize: 18 }}>{greeting}</div>
        )}
      </div >
    </>
  )
}

export default App
