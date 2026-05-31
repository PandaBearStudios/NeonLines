import {React, useEffect, useRef} from 'react'
import { Engine, Render, Composite, Bodies, Events, Runner } from 'matter-js'
import { myPlayer, usePlayersList, usePlayerState, useMultiplayerState, setState, isHost} from 'playroomkit'
import Player from './Player'

export default function TestEnv() {
    const players = usePlayersList()
    const engineRef = useRef(null)
    const bodiesRef = useRef(null)


    useEffect(() => {
        if(!isHost()) return


        engineRef.current = Engine.create()
        const engine = engineRef.current
        const cw = window.innerWidth
        const ch = window.innerHeight
        
        const walls = [
            Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
            Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
            Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
            Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
        ]
        Composite.add(engine.world, walls)

        const runner = Runner.create()
        Runner.run(runner, engine)

        Events.on(engine, 'afterUpdate', () => {
            players.forEach((p) => {
                const body = bodiesRef.current[p.id];
                if (body) {
                    p.setState('pos', { 
                        x: body.position.x, 
                        y: body.position.y, 
                        angle: body.angle 
                    });
                }
            });
        });

        return () => {
            Runner.stop(runner);
            Engine.clear(engine);
        };


    }, [players])


    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            {
                players.map((player) => (isHost() ?
                         <Player engine={engine} id={player.id} x={Math.random()*500} y={Math.random()*500}/>
                         :
                         <div> </div>
                ))
            }

        </div>
    )
}