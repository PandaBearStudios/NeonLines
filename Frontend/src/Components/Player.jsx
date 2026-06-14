import React from 'react';
import PlayerBall from "./PlayerBall.jsx";
import Brush from "./Brush.jsx";

export default function Player({ player, color }) {
    return (
        <>
            <PlayerBall player={player} color={color}/>
            <Brush player={player} color={color} />
        </>
    );
}