import PlayerBall from "./PlayerBall.jsx";
import Brush from "./Brush.jsx";
import { Engine } from 'matter-js'

export default function Player(props) {
    return (
        <div style={{width:'inherit', height:"inherit"}}>
            <PlayerBall id={props.id} engine={props.engine} x={props.x} y={props.y} />
            <Brush engine={props.engine} playerId={props.id} />
        </div>
    )
}