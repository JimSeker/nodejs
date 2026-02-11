import {createContext, useState } from 'react'

const PosContext = createContext(0);

export function PosProvider({children}) {
  const [count, setCount] = useState(0)

  return (
    <PosContext.Provider value={{count, setCount}}>
      {children}
    </PosContext.Provider>
  )
}
export default PosContext;
