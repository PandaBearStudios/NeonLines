
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Engine, Runner, Bodies, Composite, Events, Body } from 'matter-js'; 
import { usePlayersList, isHost, transferHost, myPlayer, usePlayerState } from 'playroomkit';
import Player from './Player';
import EndGameScreen from './EndGameScreen'

// NEW: Renders the expanding shockwave rings
export const ExplosionsRenderer = ({ player }) => {
    const [explosions] = usePlayerState(player, 'explosions');
    if (!explosions || explosions.length === 0) return null;

    return (
        <>
            {explosions.map(exp => (
                <div key={exp.id} style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '0px', height: '0px',
                    border: '15px solid rgba(255, 165, 0, 0.8)', // Orange blast ring
                    borderRadius: '50%',
                    transform: `translate(${exp.x}px, ${exp.y}px) translate(-50%, -50%)`,
                    pointerEvents: 'none', zIndex: 4,
                    animation: 'shockwave 0.4s ease-out forwards'
                }} />
            ))}
        </>
    );
};


// Existing Projectile Renderer
export const ProjectilesRenderer = ({ player }) => {
    const [projectiles] = usePlayerState(player, 'activeProjectiles');
    if (!projectiles || projectiles.length === 0) return null;

    return (
        <>
            {projectiles.map(proj => (
                <div key={proj.id} style={{
                    position: 'absolute', top: 0, left: 0, width: '30px', height: '30px',
                    backgroundColor: 'orange', borderRadius: '50%', boxShadow: '0 0 20px orange',
                    transform: `translate(${proj.x}px, ${proj.y}px) translate(-50%, -50%)`,
                    pointerEvents: 'none', zIndex: 5
                }} />
            ))}
        </>
    );
};