import { React, useRef, useEffect, useState } from 'react';
import { usePlayerState, myPlayer } from 'playroomkit';

export default function Brush({ player, color }) {
    const isDrawing = useRef(false);
    const clearBrush = usePlayerState(player, 'clearBrush')[0];
    
    // Read the array of validated visual dots for this specific player
    const [visualBrushes] = usePlayerState(player, 'visualBrushes');
    const dots = visualBrushes || [];

    // FIX: Safely check if this player object belongs to the local user
    const isMe = myPlayer()?.id === player.id;

    const handleMouseDown = () => {
        if (!isMe || !myPlayer().getState('alive')) return; // Ignore clicks if this isn't our player
        player.setState('clearBrush', true); // Ensure clearBrush is false when we start drawing
        myPlayer().setState('ink', 30); // Reset ink to 30 on mouse down
        isDrawing.current = true;
        player.setState('visualBrushes', []); 
    };

    const handleMouseUp = () => {
        if (!isMe || !myPlayer().getState('alive')) return;
        isDrawing.current = false;
        
    };

    const handleMouseMove = (e) => {
        if (!isMe || !isDrawing.current || !myPlayer().getState('alive')) return;
        if (myPlayer().getState('ink') > 0) {
            myPlayer().setState('ink', myPlayer().getState('ink') - 1);

            player.setState('spawnBrush', {
                x: e.clientX,
                y: e.clientY,
                id: `${player.id}-${Date.now()}-${Math.random()}`
            });
        }
    };

    if (!myPlayer().getState('alive')) return null;


    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ 
                width: '100vw', 
                height: '100vh', 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                zIndex: 1,
                // CRITICAL: Let clicks pass through other players' layers
                pointerEvents: isMe ? 'auto' : 'none' 
            }}
        >
            {/* Render neon dots for this player */}
            {
            myPlayer().getState('clearBrush') ? null :
            dots.map((dot) => (
                <div
                    key={dot.id}
                    className="brush-dot"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '20px',
                        height: '20px',
                        backgroundColor: color || '#b3ff00',
                        filter: 'drop-shadow(0 0 5px ' + color + ')',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        transform: `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`
                    }}
                />
            ))}
        </div>
    );
}