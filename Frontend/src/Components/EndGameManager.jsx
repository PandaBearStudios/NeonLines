import React, { useEffect, useRef, useState } from 'react';
import { myPlayer, usePlayerState, usePlayersList, useMultiplayerState, onPlayerJoin } from 'playroomkit';
import EndGameScreen from './EndGameScreen';

export default function EndGameManager({ onNewMatch }) {
    // PASSING 'true' IS CRITICAL: It forces a re-render when ANY player's state changes.
    const players = usePlayersList(true); 
    const [clock] = useMultiplayerState('clock', 5);
    const [isAlive] = usePlayerState(myPlayer(), 'alive');
    const [aliveTime, setAliveTime] = useState(0);
    const aliveStartedAtRef = useRef(null);
    
    // Filter down to players who are alive
    const alivePlayers = players.filter(p => p.getState('alive') !== false);
    
    const isGameOver = players.length > 1 
        ? (clock === 0 && alivePlayers.length <= 1)
        : (alivePlayers.length === 0);
    const gameStarted = localStorage.getItem('gameMode') === 'solo' || clock === 0;

    useEffect(() => {
        if (aliveStartedAtRef.current === null && gameStarted && isAlive !== false) {
            aliveStartedAtRef.current = Date.now();
        }

        if (aliveStartedAtRef.current === null || !gameStarted || isAlive === false || isGameOver) {
            return undefined;
        }

        const updateAliveTime = () => {
            setAliveTime(Date.now() - aliveStartedAtRef.current);
        };

        updateAliveTime();
        const timer = setInterval(updateAliveTime, 1000);
        return () => clearInterval(timer);
    }, [clock, isAlive, isGameOver, gameStarted]);

    // Debugging: This will let you see exactly what the manager sees in your browser console.
    console.log(`[EndGameManager] Clock: ${clock} | Total Players: ${players.length} | Alive: ${alivePlayers.length} | GameOver: ${isGameOver}`);

    if (!isGameOver) return null;

    return <EndGameScreen players={players} aliveTime={aliveTime} onNewMatch={onNewMatch} />;
}