import React, { useEffect, useRef } from 'react';
import { Engine, Runner, Bodies, Composite, Events } from 'matter-js';
import { usePlayersList, isHost, transferHost, myPlayer} from 'playroomkit';
import Player from './Player';

export default function TestEnv() {
    const players = usePlayersList();
    
    const playersRef = useRef(players); 
    const engineRef = useRef(null);
    const bodiesRef = useRef({}); 
    const brushBodiesRef = useRef({}); 

    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    useEffect(() => {
        myPlayer().setState('ink', 100);
        console.log("Initial Ink Set to 100 for player:", myPlayer().id);
        const handleVisibilityChange = () => {
            // If the browser tab is hidden and we are the current host
            if (document.hidden && isHost()) {
                const me = myPlayer();
                
                // Find the first available player that ISN'T us
                const nextHost = playersRef.current.find((p) => p.id !== me?.id);
                
                if (nextHost) {
                    console.log("Tab backgrounded! Transferring Host to:", nextHost.id);
                    
                    // Manually force Playroom to make them the host
                    transferHost(nextHost.id); 
                    
                    // Optional: Stop our local physics engine immediately to prevent ghost calculations
                    if (engineRef.current) {
                    // Matter.Runner.stop(runnerRef.current); 
                    // (You'll need a ref for your runner if you want to cleanly stop it here)
                    }
                } else {
                    console.log("No other players available to take over. Game is paused.");
                }
            }
        };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}, []);

    
    // NEW: A reusable function to boot the engine
    const startPhysicsEngine = () => {
        console.log("Booting Physics Engine! I am the Host.");
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

        Events.on(engine, 'afterUpdate', () => {
            if (!bodiesRef.current) bodiesRef.current = {};

            playersRef.current.forEach((p) => {
                const body = bodiesRef.current[p.id];
                if (body) {
                    p.setState('pos', { 
                        x: body.position.x, 
                        y: body.position.y, 
                        angle: body.angle 
                    });
                }
                
                // ... (Keep your existing HOST BRUSH LOGIC here) ...
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
    };

    // The Host Migration Check
    useEffect(() => {
        // If we are the host, AND the engine hasn't been started yet...
        if (isHost() && !engineRef.current) {
            startPhysicsEngine();
        }

        // We only want to handle player spawning if we are the active host
        if (!isHost() || !engineRef.current) return;
        if (!bodiesRef.current) bodiesRef.current = {};

        players.forEach((p) => {
            if (!bodiesRef.current[p.id]) {
                // MIGRATION MAGIC: Check if they already have a network position!
                const existingPos = p.getState('pos');
                
                // If they have a previous position, spawn them there. Otherwise, drop from ceiling.
                const startX = existingPos ? existingPos.x : 200 + (Math.random() * 50);
                const startY = existingPos ? existingPos.y : 100;

                const ball = Bodies.circle(startX, startY, 25, {
                    restitution: 1.2,
                    friction: 0.005
                });
                
                Composite.add(engineRef.current.world, ball);
                bodiesRef.current[p.id] = ball;
            }
        });

    // Run this check every time the player list changes (like when the old host disconnects)
    }, [players]); 

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative',  }}>
            {players.map((player) => (
                <Player key={player.id} player={player} color={"#" + Math.floor(Math.random()*16777215).toString(16)}/>
            ))}
        </div>
    );
}