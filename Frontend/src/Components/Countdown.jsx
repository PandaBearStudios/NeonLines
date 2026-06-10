import { useMultiplayerState, isHost, usePlayersList } from "playroomkit";
import { useEffect } from "react";

export default function Countdown({ count }){
    const [time, setTime] = useMultiplayerState('clock', count)
    const players = usePlayersList()

    useEffect(() => {
        const timer = async () => {
            for (let i = count; i > 0; i-1) {
                await setTimeout(() => {
                    setTime(i)
                }, 1000)
            }
        }
        console.log('a')
        timer()
    }, [])

    return(
        <>
            <h1 style={{marginTop: '10%'}}>{time}</h1>
        </>
    )
}