import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Engine, Runner, Bodies, Composite, Events, Body } from 'matter-js'; 
import { usePlayersList, isHost, transferHost, myPlayer, usePlayerState, getState } from 'playroomkit';

import Player from '../Components/Player';
import EndGameScreen from '../Components/EndGameScreen'
import { ExplosionsRenderer, ProjectilesRenderer } from '../Components/explosiveBall';
import Countdown from '../Components/Countdown';




export default function GameEnv() {
    const players = usePlayersList();

    const playersRef = useRef(players); 
    const engineRef = useRef(null);
    const bodiesRef = useRef({}); 
    const brushBodiesRef = useRef({});
    
    const projectilesRef = useRef([]); 
    const explosionsRef = useRef([]); // NEW: Tracks explosion coordinates
    const lastShotTimeRef = useRef(Date.now());
    const lastSyncTimeRef = useRef(Date.now()); 

    const navigate = useNavigate();

    useEffect(() => {
        if (isHost()) {
            players.forEach(p => {
                p.setState('alive', true);
            });
        }
        playersRef.current = players;
    }, [players]);

    useEffect(() => {
        myPlayer().setState('ink', 50);
        myPlayer().setState('alive', true);
        myPlayer().setState('clearBrush', false);
        
        const handleVisibilityChange = () => {
            if (document.hidden && isHost()) {
                const me = myPlayer();
                const nextHost = playersRef.current.find((p) => p.id !== me?.id);
                if (nextHost) {
                    transferHost(nextHost.id); 
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const startPhysicsEngine = () => {
        engineRef.current = Engine.create();
        const engine = engineRef.current;
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        const turretBody = Bodies.rectangle(cw / 2, 50, 80, 80, { 
            isStatic: true, 
            label: 'Wall', 
            fillStyle: '#333' 
        });

        const walls = [
            turretBody,
            Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true, label: 'Wall' }),
            Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true, label: 'Wall', fillStyle: 'red' }),
            Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true, label: 'Wall', fillStyle: 'red' }),
            Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true, label: 'Wall', fillStyle: 'red' }),
        ];
        Composite.add(engine.world, walls);

        const runner = Runner.create();
        Runner.run(runner, engine);

        Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                
                const isProjectileA = bodyA.label === 'Projectile';
                const isProjectileB = bodyB.label === 'Projectile';

                // FIX: If a projectile hits anything, flag it for instant explosion
                if (isProjectileA || isProjectileB) {
                    const projectileBody = isProjectileA ? bodyA : bodyB;
                    projectileBody.isExploding = true; 
                    
                    const otherBody = isProjectileA ? bodyB : bodyA;
                    if (otherBody.label !== 'Wall') {
                        // It hit a player directly
                        const player = playersRef.current.find(p => p.id === otherBody.id);
                        if (player) player.setState('alive', false);
                    }
                } else if (bodyA.label === 'Wall' || bodyB.label === 'Wall') {
                    if (getState('clock') != 0) return
                    const otherBody = bodyA.label === 'Wall' ? bodyB : bodyA;

                    myPlayer().leaveRoom()
                    Composite.remove(engine.world, otherBody);
                    playersRef.current.find(p => p.id === otherBody.id)?.setState('alive', false);

                    document.querySelector('.endgame-screen').style.visibility = "visible"
                    document.querySelector('.endgame-text').textContent = players.length == 0 ? 'YOU WON!!': players.length
                }
            });
        });

        Events.on(engine, 'afterUpdate', () => {
            if (!bodiesRef.current) bodiesRef.current = {};

            playersRef.current.forEach((p) => {
                if (p.getState('clearBrush')) {
                    const oldBodies = brushBodiesRef.current[p.id] || [];
                    oldBodies.forEach(b => { Composite.remove(engine.world, b); });
                    brushBodiesRef.current[p.id] = []; 
                    p.setState('clearBrush', false); 
                }
                const body = bodiesRef.current[p.id];
                if (body) {
                    p.setState('pos', { x: body.position.x, y: body.position.y, angle: body.angle });
                }
                
                const pendingBrush = p.getState('spawnBrush');
                if (pendingBrush && pendingBrush.id !== p.getState('lastProcessedBrushId')) {
                    if (p.getState('clearOldBrush') === true) {
                        const oldBodies = brushBodiesRef.current[p.id] || [];
                        oldBodies.forEach(b => { b.isSensor = true; });
                        brushBodiesRef.current[p.id] = []; 
                        p.setState('clearOldBrush', false); 
                    }
                    const brushBall = Bodies.circle(pendingBrush.x, pendingBrush.y, 10, {
                        isStatic: true, restitution: 1.4, friction: 0.005
                    });
                    Composite.add(engine.world, brushBall);
                    if (!brushBodiesRef.current[p.id]) brushBodiesRef.current[p.id] = [];
                    brushBodiesRef.current[p.id].push(brushBall);
                    const currentVisuals = p.getState('visualBrushes') || [];
                    p.setState('visualBrushes', [...currentVisuals, { x: pendingBrush.x, y: pendingBrush.y, id: pendingBrush.id }]);
                    p.setState('lastProcessedBrushId', pendingBrush.id);
                }
            });

            const now = Date.now();

            if (now - lastShotTimeRef.current > 3000) { 
                lastShotTimeRef.current = now;
                
                const activePlayerIds = Object.keys(bodiesRef.current).filter(id => {
                    const p = playersRef.current.find(player => player.id === id);
                    return p && p.getState('alive') !== false;
                });

                if (activePlayerIds.length > 0) {
                    const projBody = Bodies.circle(cw / 2, 120, 15, { 
                        label: 'Projectile', 
                        restitution: 0.8, 
                        friction: 0.005,
                        density: 0.05 
                    });
                    
                    const targetId = activePlayerIds[Math.floor(Math.random() * activePlayerIds.length)];
                    const targetBody = bodiesRef.current[targetId];
                    
                    const dx = targetBody.position.x - projBody.position.x;
                    const dy = targetBody.position.y - projBody.position.y;
                    const angle = Math.atan2(dy, dx);
                    
                    const speed = 12; 
                    Body.setVelocity(projBody, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
                    
                    Composite.add(engine.world, projBody);
                    projectilesRef.current.push({ id: Math.random().toString(), body: projBody });
                }
            }

            const activeProjectiles = [];
            const triggerRadius = 80;   
            const blastRadius = 250;    
            const blastForce = 0.15;    
            
            projectilesRef.current.forEach((proj) => {
                let exploded = false;

                // Explode if it hit an object (flagged in collisionStart)
                if (proj.body.isExploding) {
                    exploded = true;
                }

                Object.entries(bodiesRef.current).forEach(([pId, playerBody]) => {
                    if (exploded) return;
                    
                    const p = playersRef.current.find(player => player.id === pId);
                    if (!p || p.getState('alive') === false) return;

                    const dx = playerBody.position.x - proj.body.position.x;
                    const dy = playerBody.position.y - proj.body.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Explode if proximity is triggered
                    if (dist < triggerRadius) {
                        exploded = true;
                    }
                });

                if (exploded) {
                    // Apply shockwave forces
                    Object.entries(bodiesRef.current).forEach(([blastId, pb]) => {
                        const bp = playersRef.current.find(player => player.id === blastId);
                        if (!bp || bp.getState('alive') === false) return;

                        const pDx = pb.position.x - proj.body.position.x;
                        const pDy = pb.position.y - proj.body.position.y;
                        const pDist = Math.sqrt(pDx * pDx + pDy * pDy);
                        
                        if (pDist < blastRadius) {
                            const forceMagnitude = blastForce * (1 - (pDist / blastRadius));
                            const pAngle = Math.atan2(pDy, pDx);
                            
                            Body.applyForce(pb, pb.position, {
                                x: Math.cos(pAngle) * forceMagnitude,
                                y: Math.sin(pAngle) * forceMagnitude
                            });
                        }
                    });

                    // Remove body and record visual explosion coordinates
                    Composite.remove(engine.world, proj.body); 
                    explosionsRef.current.push({
                        id: proj.id,
                        x: proj.body.position.x,
                        y: proj.body.position.y,
                        timestamp: now
                    });
                } else {
                    activeProjectiles.push(proj); 
                }
            });
            
            projectilesRef.current = activeProjectiles;

            // Clean up visual explosions older than 400ms
            explosionsRef.current = explosionsRef.current.filter(exp => now - exp.timestamp < 400);

            if (now - lastSyncTimeRef.current > 50) {
                myPlayer().setState('activeProjectiles', activeProjectiles.map(p => ({
                    id: p.id, x: p.body.position.x, y: p.body.position.y
                })));
                
                // Sync current visual explosions to all clients
                myPlayer().setState('explosions', explosionsRef.current.map(e => ({
                    id: e.id, x: e.x, y: e.y
                })));

                lastSyncTimeRef.current = now;
            }
        });
    };

    useEffect(() => {
        if (isHost() && !engineRef.current) {
            startPhysicsEngine();
        }

        if (!isHost() || !engineRef.current) return;
        if (!bodiesRef.current) bodiesRef.current = {};

        players.forEach((p) => {
            if (!bodiesRef.current[p.id]) {
                const existingPos = p.getState('pos');
                const startX = existingPos ? existingPos.x : 100 + (Math.random() * 1000);
                const startY = existingPos ? existingPos.y : 100;

                const ball = Bodies.circle(startX, startY, 25, {
                    id: p.id,
                    restitution: 1.5,
                    friction: 0.005
                });
                
                Composite.add(engineRef.current.world, ball);
                bodiesRef.current[p.id] = ball;

                const existingBrushes = p.getState('visualBrushes') || [];
                if (existingBrushes.length > 0) {
                    if (!brushBodiesRef.current[p.id]) brushBodiesRef.current[p.id] = [];
                    existingBrushes.forEach((brushDot) => {
                        const brushBall = Bodies.circle(brushDot.x, brushDot.y, 10, {
                            isStatic: true, restitution: 1, friction: 0.005
                        });
                        Composite.add(engineRef.current.world, brushBall);
                        brushBodiesRef.current[p.id].push(brushBall);
                    });
                }
            }
        });
    }, [players]);

    useEffect(() => {
        const wasAlreadyInRoom = sessionStorage.getItem('inGameEnv');
        if (wasAlreadyInRoom) {
            myPlayer().leaveRoom();
            navigate('/');
            sessionStorage.removeItem('inGameEnv');
        } else {
            sessionStorage.setItem('inGameEnv', 'true');
        }
        return () => {
            if (!sessionStorage.getItem('refreshing')) {
                sessionStorage.removeItem('inGameEnv');
            }
        };
    }, [navigate]);

    return (

        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <Countdown count={5} engine={engineRef.current}/>
            <EndGameScreen/>
            {/* Inline CSS for the shockwave animation */}
            <style>{`
                @keyframes shockwave {
                    0% { width: 0px; height: 0px; opacity: 1; border-width: 30px; }
                    100% { width: 500px; height: 500px; opacity: 0; border-width: 2px; }
                }
            `}</style>

            <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '98%', backgroundColor: 'red', boxShadow: '0 0 10px red, 0 0 20px red' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '20px', backgroundColor: 'red', boxShadow: '0 0 10px red, 0 0 20px red' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '98%', backgroundColor: 'red', boxShadow: '0 0 10px red, 0 0 20px red' }} />
            
            <div style={{ 
                position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', 
                width: '80px', height: '80px', backgroundColor: '#333', border: '2px solid orange', 
                color: 'orange', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 'bold', zIndex: 10, borderRadius: '10px', boxShadow: '0 0 15px orange' 
            }}>
                TURRET
            </div>

            {players.map((player) => (
                <React.Fragment key={player.id}>
                    <ProjectilesRenderer player={player} />
                    {/* Render the explosions synced by the Host */}
                    <ExplosionsRenderer player={player} />
                    
                    {player.getState('alive') !== false ? (
                        <Player player={player} color={"#" + Math.floor(Math.random()*16777215).toString(16)}/>
                    ) : (
                        <div style={{position: 'absolute', top: 0, left: 0, color: 'white'}}>
                            Player {player.id} is out!
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}