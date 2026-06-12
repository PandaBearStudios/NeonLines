import React from 'react';
import { useNavigate } from 'react-router-dom';
import { myPlayer, startMatchmaking, insertCoin } from 'playroomkit';
import  '../css/EndGameScreen.css';

export default function EndGameScreen() {
    const navigate = useNavigate();
    const handleNewMatch = async () => {
        myPlayer().leaveRoom();
        startMatchmaking(); // Start matchmaking again to find a new game
        window.location.reload(); // Force reload to reset game state and trigger matchmaking again
    }

    const handleQuit = () => {
        myPlayer().leaveRoom();
        navigate('/');
    }
    return(
        <div className="endgame-screen" >
            Game Over
            <h3 className='endgame-text'>YOU LOST!!</h3>
            <div className="endgame-buttons">
                <button onClick={handleNewMatch}>New Match</button>
                <button onClick={handleQuit}>Quit</button>
            </div>
        </div>
    );
}