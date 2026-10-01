import { useNavigate } from 'react-router-dom';
import '../css/HowToPlay.css';

const rules = [
    {
        number: '01',
        title: 'Keep moving',
        description: 'Protect your ball and stay alive longer than the other players.',
    },
    {
        number: '02',
        title: 'Move your saber',
        description: 'Use your cursor to move your saber and protect your ball from the ground and turret.',
    },
    {
        number: '03',
        title: 'Avoid the red floor',
        description: 'Touching the red wall means you are out. Watch the turret at the top, too.',
    },
];

export default function HowToPlay() {
    const navigate = useNavigate();

    return (
        <main className="how-to-play">
            <button className="how-to-play__back" type="button" onClick={() => navigate('/')}>
                <span aria-hidden="true">&lt;</span> Back to menu
            </button>

            <div className="how-to-play__header">
                <p className="how-to-play__eyebrow">NEON LINES // FIELD MANUAL</p>
                <h1>How To Play</h1>
                <p className="how-to-play__intro">
                    Three players. One arena. Keep your ball alive while the ground and turret try to end your run.
                </p>
            </div>

            <ol className="how-to-play__rules">
                {rules.map((rule) => (
                    <li className="how-to-play__rule" key={rule.number}>
                        <span className="how-to-play__number">{rule.number}</span>
                        <div>
                            <h2>{rule.title}</h2>
                            <p>{rule.description}</p>
                        </div>
                    </li>
                ))}
            </ol>

            <p className="how-to-play__warning">
                <span aria-hidden="true">!</span>
                Reloading the page exits the game, so only reload when you are ready to leave.
            </p>

            <button className="how-to-play__start" type="button" onClick={() => navigate('/choice-of-play')}>
                Choose your game mode <span aria-hidden="true">-&gt;</span>
            </button>
        </main>
    );
}