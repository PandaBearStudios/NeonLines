import React from 'react';
import PlayerBall from "./PlayerBall.jsx";
import Brush from "./Brush.jsx";

export default function Player({ player }) {
    return (
        <>
            <PlayerBall player={player} />
            <Brush player={player} />
        </>
    );
}