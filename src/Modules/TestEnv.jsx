import { useEffect, useRef } from 'react'
import { Engine, Render, Runner, Bodies, Composite } from 'matter-js'

export default function TestEnv() {
  const scene = useRef(null)
  const isPressed = useRef(false)
  const engine = useRef(Engine.create())

  useEffect(() => {
    // Using the container's actual size is safer than document.body in React
    const cw = scene.current.clientWidth || window.innerWidth
    const ch = scene.current.clientHeight || window.innerHeight

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent'
      }
    })

    // Matter.js now prefers Composite.add over World.add
    Composite.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
    ])

    // 1. Create and run the Runner to update the engine physics
    const runner = Runner.create()
    Runner.run(runner, engine.current)
    
    // 2. Run the renderer
    Render.run(render)

    return () => {
      // Clean up everything on unmount to prevent ghost loops
      Render.stop(render)
      Runner.stop(runner)
      Composite.clear(engine.current.world, false)
      Engine.clear(engine.current)
      
      if (render.canvas) {
        render.canvas.remove()
      }
    }
  }, [])

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const handleAddCircle = e => {
    if (isPressed.current) {
      // Get exact cursor position relative to the physics container
      const rect = scene.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ball = Bodies.circle(
        x,
        y,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: '#0000ff'
          }
        }
      )
      
      Composite.add(engine.current.world, [ball])
    }
  }

  return (
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <div ref={scene} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}