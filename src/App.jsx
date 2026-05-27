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
      <h1>Neon Lines</h1>
      <section>
        <section className="innerGlow">
          <input type="text" className='nameInput' placeholder="Enter your name" />
          <button>Play</button>
          <button>Settings</button>
        </section>
      </section>
    </>
  )
}

export default App
