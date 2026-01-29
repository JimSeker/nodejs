import { useState } from 'react'
import Example1 from './Example1'
import Example2 from './Example2'
import Example3 from './Example3'

function App() {
  const [example, setExample] = useState(1)

  return (
    <>
      <h1>Form Examples</h1>
      <div className="card">
        <button onClick={() => setExample(() => 1)}>
          Example 1
        </button>
        <button onClick={() => setExample(() => 2)}>
          Example 2
        </button>
        <button onClick={() => setExample(() => 3)}>
          Example 3
        </button>
      </div>
      {example === 1 && (<Example1 />)}
      {example === 2 && (<Example2 />)}
      {example === 3 && (<Example3 />)}

    </>
  )
}

export default App
