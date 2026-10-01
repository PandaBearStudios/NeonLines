import { Composite, Engine, Runner } from 'matter-js';
import { myPlayer } from 'playroomkit';

export default function resetGame({
    engineRef,
    runnerRef,
    bodiesRef,
    saberBodiesRef,
    projectilesRef,
    explosionsRef,
    lastShotTimeRef,
    lastSyncTimeRef,
    aliveStartedAtRef,
    wasAliveRef,
    setAliveTime,
    setGameResetKey,
    resetPlayerState = true,
}) {
    if (runnerRef.current) {
        Runner.stop(runnerRef.current);
    }

    if (engineRef.current) {
        Composite.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
    }

    engineRef.current = null;
    runnerRef.current = null;
    bodiesRef.current = {};
    saberBodiesRef.current = {};
    projectilesRef.current = [];
    explosionsRef.current = [];
    lastShotTimeRef.current = Date.now();
    lastSyncTimeRef.current = Date.now();
    aliveStartedAtRef.current = null;
    wasAliveRef.current = true;

    if (resetPlayerState) {
        const player = myPlayer();
        player.setState('alive', true);
        player.setState('ink', 50);
        player.setState('activeProjectiles', []);
        player.setState('explosions', []);
        player.setState('pos', null);
        player.setState('saber', null);
    }

    setAliveTime(0);
    setGameResetKey((currentKey) => currentKey + 1);
}
