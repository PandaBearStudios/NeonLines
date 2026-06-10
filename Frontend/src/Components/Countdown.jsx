import { useMultiplayerState, isHost, usePlayersList } from "playroomkit";
import { useEffect } from "react";

export default function Countdown({ count }){
    const [time, setTime] = useMultiplayerState('clock', count)
    const players = usePlayersList()

    useEffect(() => {
        setTimeout(() => {
            if (time > 1)
                setTime(time-1)
        }, 1000)
        
    }, [time])

    return(
        <>
            <h1 style={{marginTop: '10%'}}>{time}</h1>
        </>
    )
}