import { useEffect, useRef, useState } from 'react'
import { Engine, Render, Runner, Bodies, Composite } from 'matter-js'

export default function PlayerBall(props) {
  const engine = useRef(props.engine || Engine.create())
  const runner = useRef(Runner.create())
  // We use this state just to know how many divs to mount.
  // The actual 60fps movement will bypass React state for performance.
  const [bodyIds, setBodyIds] = useState([])
  
  // Store references to the actual DOM elements
  const divRefs = useRef({})
  const reqRef = useRef()

  

  useEffect(() => {
    const cw = window.innerWidth
    const ch = window.innerHeight

    // 1. Create invisible physics boundaries
    const walls = [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
    ]
    Composite.add(engine.current.world, walls)

    // 2. Start the physics engine (Notice we do NOT create a Render object)
    Runner.run(runner.current, engine.current)

    const radius = 25 // 50px wide div
    const ball = Bodies.circle(props.x, props.y, radius, {
      id: props.id,
      restitution: 1.5,
      friction: 0.005
    })
    
    Composite.add(engine.current.world, [ball])

    // 2. Tell React to mount a new div for this body ID
    setBodyIds(prev => [...prev, ball.id])

    // 3. Create the sync loop: Match Div positions to Physics positions
    const syncDOM = () => {
      const bodies = Composite.allBodies(engine.current.world)
      
      bodies.forEach(body => {
        // Skip walls, we only want to render our dynamic balls
        if (body.isStatic) return 

        const div = divRefs.current[body.id]
        if (div) {
          // Matter.js coordinates are based on the center of the body.
          // We use CSS transform to move the div and rotate it.
          const x = body.position.x
          const y = body.position.y
          const angle = body.angle // in radians

          // translate(-50%, -50%) centers the div on the coordinate
          div.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}rad)`
        }
      })

      reqRef.current = requestAnimationFrame(syncDOM)
    }
    
    reqRef.current = requestAnimationFrame(syncDOM)

    return () => {
      cancelAnimationFrame(reqRef.current)
      Runner.stop(runner.current)
      Engine.clear(engine.current)
    }
  }, [])


  return (
    <div 
      
    >

      {/* Map over the IDs to render the actual HTML Divs */}
      {bodyIds.map(id => (
        <div
          key={id}
          ref={el => (divRefs.current[id] = el)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#ff4757',
            boxShadow: '0 0 15px rgba(255, 71, 87, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
            userSelect: 'none',
            // Ensure the div doesn't intercept clicks meant for the background
            pointerEvents: 'none' 
          }}
        >
          Player
        </div>
      ))}
    </div>
  )
}