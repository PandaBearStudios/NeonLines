import { useMultiplayerState, isHost, usePlayersList } from "playroomkit";
import { Composite } from "matter-js";
import { useEffect } from "react";

export default function Countdown({ count, engine }){
    const [time, setTime] = useMultiplayerState('clock', count);
    const players = usePlayersList();

    useEffect(() => {
        if(isHost()){
            setTimeout(() => {
                if (time > 1)
                    setTime(time-1);
                else {
                    players.forEach((p) => {
                        Composite.get(engine.world, p.id, 'body').isStatic = false;
                    })
                    document.querySelector('.clock').remove()
                }
            }, 1000)
        }
        
    }, [time])

    return(
        <>
            <h1 style={{marginTop: '10%'}} className="clock">{time}</h1>
        </>
    )
}