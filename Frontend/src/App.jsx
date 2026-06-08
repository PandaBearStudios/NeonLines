import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import BouncingBall from './Components/BouncingBall'
import './App.css'
import { useNavigate } from 'react-router-dom';
import { myPlayer, startMatchmaking, insertCoin } from 'playroomkit';

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();
  
  useEffect(() => {
    if (window.location.hash === '')
        window.location.reload()
  }, [])

  const handlePlay = async () => {
    let hash = ''
    myPlayer().setState('name', document.querySelector('.nameInput').value || 'Player');
    await startMatchmaking(); // Start matchmaking to find a game
    hash = window.location.hash
    navigate('/game'+hash); // Navigate to the game environment
  }
  
  return (
    <>
    <div className="nav">
      
      <BouncingBall />
      <section className='collider'>
        <h1>Neon Lines</h1>
        <input type="text" className='nameInput' placeholder="Enter your name" />
        <button onClick={handlePlay}>Play</button>
        <button>How to Play</button>
        <button>Settings</button>
      </section>
      </div>
    </>
  )
}

export default App
