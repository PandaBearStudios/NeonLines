export default function(){
    const handlePlay = async () => {
        let hash = ''
        await startMatchmaking(); // Start matchmaking to find a game
        hash = window.location.hash
        navigate('/game'+hash); // Navigate to the game environment
    }

    return (
        <div className="choice-of-play">
            <button>Solo</button>
            <button onClick={handlePlay}>Multiplayer</button>
        </div>
    );
}