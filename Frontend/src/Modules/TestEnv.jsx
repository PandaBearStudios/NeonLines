import {React, useRef} from 'react'
import { Engine } from 'matter-js'
import Player from './Player'

export default function TestEnv() {
    const engine = Engine.create()
    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <Player engine={engine} playerId={1} x={100} y={100}/>
        </div>
    )
}