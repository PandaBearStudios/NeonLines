import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { startMatchmaking, setState, getState } from 'playroomkit';
import '../css/ChoiceOfPlay.css';
export default function(){
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [isMatching, setIsMatching] = useState(false);
    const hasStartedAutoMatch = useRef(false);

    const startMultiplayer = async (isAutomatic = false, attempt = 0) => {
        if (isMatching && !isAutomatic) return;

        setIsMatching(true);
        localStorage.setItem('gameMode', 'multiplayer');
        try {
            await startMatchmaking();
            const roomTag = window.location.hash;
            navigate(`/game${roomTag}`);
        } catch (error) {
            console.error('Failed to start multiplayer matchmaking:', error);
            if (isAutomatic && attempt < 5) {
                window.setTimeout(() => {
                    startMultiplayer(true, attempt + 1);
                }, 300);
                return;
            }

            setIsMatching(false);
        }
    };

    useEffect(() => {
        const shouldAutoMatch = location.state?.autoMatch || searchParams.get('rematch') === '1';

        if (shouldAutoMatch && !hasStartedAutoMatch.current) {
            hasStartedAutoMatch.current = true;

            if (sessionStorage.getItem('rematchReloaded') !== 'true') {
                sessionStorage.setItem('rematchReloaded', 'true');
                window.location.reload();
                return;
            }

            sessionStorage.removeItem('rematchReloaded');
            const retryTimer = window.setTimeout(() => {
                startMultiplayer(true);
            }, 150);

            return () => window.clearTimeout(retryTimer);
        }
    }, [location.state, searchParams]);

    const handleSoloPlay = () => {
        localStorage.setItem('gameMode', 'solo');
        setState('clock', 0); 
        navigate('/game');
    }
    const handleMultiplayerPlay = async () => {
        await startMultiplayer();
    }

    return (
        <section className="choice-of-play">
            <button onClick={handleSoloPlay} disabled={isMatching}>Solo</button>
            <button onClick={handleMultiplayerPlay} disabled={isMatching} aria-busy={isMatching}>
                Multiplayer
            </button>
            {isMatching && (
                <div className="matchmaking-status">
                    <span className="loading-spinner" aria-hidden="true" />
                    <span>Finding match...</span>
                </div>
            )}
        </section>
    );
}