import React from 'react';
import { usePlayersList, useMultiplayerState } from 'playroomkit';
import EndGameScreen from './EndGameScreen';

export default function EndGameManager() {
    // PASSING 'true' IS CRITICAL: It forces a re-render when ANY player's state changes.
    const players = usePlayersList(true); 
    const [clock] = useMultiplayerState('clock', 5);
    
    // Filter down to players who are alive
    const alivePlayers = players.filter(p => p.getState('alive') !== false);
    
    const isGameOver = players.length > 1 
        ? (clock === 0 && alivePlayers.length <= 1)
        : (alivePlayers.length === 0);

    // Debugging: This will let you see exactly what the manager sees in your browser console.
    console.log(`[EndGameManager] Clock: ${clock} | Total Players: ${players.length} | Alive: ${alivePlayers.length} | GameOver: ${isGameOver}`);

    if (!isGameOver) return null;

    return <EndGameScreen players={players} />;
}