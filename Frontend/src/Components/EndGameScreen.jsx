import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { myPlayer } from 'playroomkit';
import '../css/EndGameScreen.css';

export default function EndGameScreen({ players, aliveTime, onNewMatch }) {
    const navigate = useNavigate();
    const me = myPlayer();
    
    // Check if the local player is still alive
    const isAlive = me?.getState('alive') !== false;
    // Determine the text based on player count and alive status
    let titleText = "Game Over";
    if (players?.length > 1) {
        titleText = isAlive ? "🏆 You Win! 🏆" : "💀 You Lose! 💀";
    }

    const secondsAlive = Math.floor(aliveTime / 1000);
    const minutes = Math.floor(secondsAlive / 60).toString().padStart(2, '0');
    const seconds = (secondsAlive % 60).toString().padStart(2, '0');

    const handleNewMatch = async () => {
        await onNewMatch();
    }

    const handleQuit = () => {
        navigate('/');
    }

    return(
        // We force visibility to 'visible' here in case your CSS previously set it to hidden
        <div className="endgame-screen" style={{ visibility: 'visible', zIndex: 100 }}>
            <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '20px' }}>
                {titleText}
            </h1>
            <p>Time Alive: {minutes}:{seconds}</p>
            <div className="endgame-buttons">
                <button onClick={handleNewMatch}>New Match</button>
                <button onClick={handleQuit}>Quit</button>
            </div>
        </div>
    );
}