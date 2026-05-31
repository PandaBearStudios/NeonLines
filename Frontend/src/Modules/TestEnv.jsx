import React, { useEffect, useRef } from 'react';
import { Engine, Runner, Bodies, Composite, Events } from 'matter-js';
import { usePlayersList, isHost } from 'playroomkit';
import Player from './Player';

export default function TestEnv() {
    const players = usePlayersList();
    
    // NEW: Keep a mutable reference of the player list for the physics loop
    const playersRef = useRef(players); 
    const engineRef = useRef(null);
    const bodiesRef = useRef({}); 
    const brushBodiesRef = useRef({}); 

    // Always keep the ref updated with the latest players
    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    useEffect(() => {
        if (!isHost()) return; 

        // Initialize Host Engine
        engineRef.current = Engine.create();
        const engine = engineRef.current;
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        const walls = [
            Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
            Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
            Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
            Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
        ];
        Composite.add(engine.world, walls);

        const runner = Runner.create();
        Runner.run(runner, engine);

        // Host Physics & Broadcast Loop
        Events.on(engine, 'afterUpdate', () => {
            if (!bodiesRef.current) bodiesRef.current = {};

            // FIX: Iterate over playersRef.current to avoid stale closures
            playersRef.current.forEach((p) => {
                const body = bodiesRef.current[p.id];
                if (body) {
                    p.setState('pos', { 
                        x: body.position.x, 
                        y: body.position.y, 
                        angle: body.angle 
                    });
                }

                // --- HOST BRUSH LOGIC ---
                const pendingBrush = p.getState('spawnBrush');
                if (pendingBrush && pendingBrush.id !== p.getState('lastProcessedBrushId')) {
                    
                    if (p.getState('clearOldBrush') === true) {
                        const oldBodies = brushBodiesRef.current[p.id] || [];
                        oldBodies.forEach(b => { b.isSensor = true; });
                        brushBodiesRef.current[p.id] = []; 
                        p.setState('clearOldBrush', false); 
                    }

                    const brushBall = Bodies.circle(pendingBrush.x, pendingBrush.y, 10, {
                        isStatic: true,
                        restitution: 1.4,
                        friction: 0.005
                    });

                    Composite.add(engine.world, brushBall);
                    
                    if (!brushBodiesRef.current[p.id]) brushBodiesRef.current[p.id] = [];
                    brushBodiesRef.current[p.id].push(brushBall);

                    const currentVisuals = p.getState('visualBrushes') || [];
                    p.setState('visualBrushes', [...currentVisuals, { x: pendingBrush.x, y: pendingBrush.y, id: pendingBrush.id }]);

                    p.setState('lastProcessedBrushId', pendingBrush.id);
                }
            });
        });

        return () => {
            Runner.stop(runner);
            Engine.clear(engine);
        };
    }, []); // <--- FIX: Empty dependency array. Engine only creates ONCE.

    // Handle spawning player avatars (Host only)
    useEffect(() => {
        if (!isHost() || !engineRef.current) return;
        if (!bodiesRef.current) bodiesRef.current = {};

        players.forEach((p) => {
            if (!bodiesRef.current[p.id]) {
                const ball = Bodies.circle(window.innerWidth / 2, 100, 25, {
                    restitution: 1.2,
                    friction: 0.005
                });
                Composite.add(engineRef.current.world, ball);
                bodiesRef.current[p.id] = ball;
            }
        });
    }, [players]); // This safely runs whenever someone joins

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: '#1e272e' }}>
            {players.map((player) => (
                <Player key={player.id} player={player} />
            ))}
        </div>
    );
}