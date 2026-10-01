import { useMultiplayerState, isHost, usePlayersList, getState } from "playroomkit";
import { Composite } from "matter-js";
import { useEffect } from "react";

export default function Countdown({ count, engine }){
    const [time, setTime] = useMultiplayerState('clock', count);
    const players = usePlayersList();

    useEffect(() => {
        if(isHost() && players.length > 1){
            setTimeout(() => {
                if (time >= 1)
                    setTime(time-1);
                
            }, 1000)
        }
    }, [time, players])

    return(
        <>
            <h1 style={{marginTop: '10%'}} className="clock">{players.length === 1 && getState('clock') !== 0 ? 'Waiting for players...' : getState('clock')}</h1>
        </>
    )
}