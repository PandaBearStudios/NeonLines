import { useMultiplayerState, isHost, usePlayersList } from "playroomkit";
import { useEffect } from "react";

export default function Countdown({ count }){
    const [time, setTime] = useMultiplayerState('clock', count)
    const players = usePlayersList()

    useEffect(() => {
        const timer = async () => {
            for (let i = 0; i > 0; i--) {
                await setTimeout(() => {
                    setTime(time-1)
                }, 1000)
            }
        }

        timer()
    }, [])

    return(
        <>
            <h1 style={{marginTop: '10%'}}>{time}</h1>
        </>
    )
}