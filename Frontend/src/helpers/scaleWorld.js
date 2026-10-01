import { useState, useEffect } from "react";

export default function scaleWorld(worldW, worldH) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calc = () => {
            const scaleConst = Math.min(window.innerWidth / worldW, window.innerHeight / worldH);
            setScale(scaleConst);
        }
        calc();
        window.addEventListener('resize', calc);

        return () => window.removeEventListener('resize', calc);
    }, [worldW, worldH]);

    return scale;
}