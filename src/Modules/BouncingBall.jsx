import { useEffect, useRef } from "react";
import "../Styles/BouncingBall.css";

function ballRectCollision(ballRect, rectRect) {
  return !(
    ballRect.right < rectRect.left ||
    ballRect.left > rectRect.right ||
    ballRect.bottom < rectRect.top ||
    ballRect.top > rectRect.bottom
  );
}

export default function BouncingBall() {
  const ballRef = useRef(null);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    let x = -10;
    let y = -400; 

    let vx = 0; 
    let vy = 0; 

    const gravity = 0.5;
    const bounce = 1.00000001; 
    const size = 60; 

    let animationId; 

    function animate() {
      // 1. Apply gravity
      vy += gravity;

      // 2. Move ball
      x += vx;
      y += vy;

      // Note: we get the bounding box AFTER adding the velocity
      // so we know exactly where it is attempting to go this frame
      const ballRect = ball.getBoundingClientRect();
      const colliders = document.querySelectorAll(".collider");
      let isGrounded = false;

      // 3. Check collisions
      colliders.forEach((collider) => {
        const rectRect = collider.getBoundingClientRect();

        if (ballRectCollision(ballRect, rectRect)) {
          // FIX: Only trigger a bounce if the ball is falling downward
          if (vy > 0) {
            // Calculate exactly how many pixels the ball penetrated the floor
            const overlapY = ballRect.bottom - rectRect.top;
            
            // Push the relative Y translation back up by that exact amount
            y -= overlapY; 
            
            // Reverse velocity and lose some energy
            vy *= -bounce;
            isGrounded = true;
          }
        }
      });

      // 4. Stop tiny endless floor jitter
      if (isGrounded && Math.abs(vy) < 1.5) {
        vy = 0;
      }

      // 5. Update DOM
      ball.style.transform = `translate(${x}px, ${y}px)`;

      // 6. Request next frame
      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <div ref={ballRef} className="gravity-ball" />;
}