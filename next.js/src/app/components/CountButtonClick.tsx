'use client'

import { useState } from 'react'

export function CountButtonClick() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount((count) => count + 1)
  }

  return (
    <div>
      <h2>Counter</h2>
      <p>{count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  )
}
