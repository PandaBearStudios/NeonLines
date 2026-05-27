import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import BouncingBall from './Modules/BouncingBall'
import './App.css'

function App() {
  const [count, setCount] = useState(0)


  
  return (
    <>
      <section>
        <BouncingBall />
      </section>
    </>
  )
}

export default App
