import React from 'react';
import { usePlayerState } from 'playroomkit';

export default function PlayerBall({ player, color }) {
    // 1. Read the position calculated by the Host
    const [pos] = usePlayerState(player, 'pos');

    // 2. If the host hasn't calculated our position yet, render nothing
    if (!pos) return null;

    // 3. Render exactly one ball using the Host's coordinates
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: color || '#ff4757',
            boxShadow: '0 0 15px ' + color || '#ff4757',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
            userSelect: 'none',
            pointerEvents: 'none', // Lets clicks pass through to the Brush component
            transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${pos.angle}rad)`
        }}>
            Player
        </div>
    );
}