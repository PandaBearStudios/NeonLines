import { useEffect, useRef, useState } from "react";
import "../Styles/BouncingBall.css";


function ballRectCollision(ball, rect) {
  const ballRect = ball.getBoundingClientRect();
  const rectRect = rect.getBoundingClientRect();

  return !(
    ballRect.right < rectRect.left ||
    ballRect.left > rectRect.right ||
    ballRect.bottom < rectRect.top ||
    ballRect.top > rectRect.bottom
  );
}


export default function BouncingBall() {
    const ballRef = useRef(null);
    const [colliders, setColliders] = useState(document.querySelectorAll(".collider"));

  useEffect(() => {
    const ball = ballRef.current;

    let x = 100;
    let y = 100;

    let vx = 4; // horizontal velocity
    let vy = 2; // vertical velocity

    const gravity = 0.4;
    const bounce = 0.8;

    const size = 60;

    function animate() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // apply gravity
      vy += gravity;

      // move ball
      x += vx;
      y += vy;

      // collision: floor
      if (y + size >= height) {
        y = height - size;
        vy *= -bounce;
      }

      // collision: ceiling
      if (y <= 0) {
        y = 0;
        vy *= -bounce;
      }

      // collision: right wall
      if (x + size >= width) {
        x = width - size;
        vx *= -bounce;
      }

      // collision: left wall
      if (x <= 0) {
        x = 50;
        vx *= -bounce;
      }

      // stop tiny endless floor jitter
      if (Math.abs(vy) < 0.5 && y + size >= height) {
        vy = 0;
      }

      ball.style.transform = `translate(${x}px, ${y}px)`;

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <div ref={ballRef} className="gravity-ball" />;
}
