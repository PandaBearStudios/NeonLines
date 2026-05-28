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
    <div className="nav">
      
      <BouncingBall />
      <section className='collider'>
        <h1>Neon Lines</h1>
        <input type="text" className='nameInput' placeholder="Enter your name" />
        <button>Play</button>
        <button>Settings</button>
      </section>
      </div>
    </>
  )
}

export default App
