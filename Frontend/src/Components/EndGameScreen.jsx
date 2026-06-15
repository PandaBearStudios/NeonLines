import React from 'react';
import { useNavigate } from 'react-router-dom';
import { myPlayer, startMatchmaking } from 'playroomkit';
import '../css/EndGameScreen.css';

export default function EndGameScreen({ players }) {
    const navigate = useNavigate();
    const me = myPlayer();
    
    // Check if the local player is still alive
    const isAlive = me?.getState('alive') !== false;
    
    // Determine the text based on player count and alive status
    let titleText = "Game Over";
    if (players?.length > 1) {
        titleText = isAlive ? "🏆 You Win! 🏆" : "💀 You Lose! 💀";
    }

    const handleNewMatch = async () => {
        me.leaveRoom();
        startMatchmaking(); // Start matchmaking again to find a new game
        window.location.reload(); // Force reload to reset game state
    }

    const handleQuit = () => {
        me.leaveRoom();
        navigate('/');
    }

    return(
        // We force visibility to 'visible' here in case your CSS previously set it to hidden
        <div className="endgame-screen" style={{ visibility: 'visible', zIndex: 100 }}>
            <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '20px' }}>
                {titleText}
            </h1>
            <div className="endgame-buttons">
                <button onClick={handleNewMatch}>New Match</button>
                <button onClick={handleQuit}>Quit</button>
            </div>
        </div>
    );
}