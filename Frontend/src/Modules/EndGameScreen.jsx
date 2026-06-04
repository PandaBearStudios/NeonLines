import  '../css/EndGameScreen.css';

export default function EndGameScreen() {
    return(
        <div className="endgame-screen">
            Game Over
            <div className="endgame-buttons">
                <button>Another Game</button>
                <button>Quit</button>
            </div>
        </div>
    );
}