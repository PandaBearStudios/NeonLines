import PlayerBall from "./PlayerBall.jsx";
import Brush from "./Brush.jsx";

export default function Player({ player, color, worldRef, WORLD_W, WORLD_H, scale }) {
    return (
        <>
            <PlayerBall player={player} color={color}/>
            <Brush player={player} color={color} worldRef={worldRef} WORLD_W={WORLD_W} WORLD_H={WORLD_H} scale={scale}/>
        </>
    );
}