import {React, useRef} from 'react'
import PlayerBall from './PlayerBall'
import { Engine } from 'matter-js'

export default function TestEnv() {
    const engine = Engine.create()
    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>

            <PlayerBall engine={engine} x={100} y={100} />
            <PlayerBall engine={engine} x={500} y={50} />
        </div>
    )
}