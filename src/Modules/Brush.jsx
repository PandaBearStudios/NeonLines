import { useEffect, useRef, useState } from 'react'
import { Engine, Render, Runner, Bodies, Composite } from 'matter-js'


export default function Brush(props) {
    const engine = useRef(props.engine || Engine.create())
    const runner = useRef(Runner.create())
    const isDrawing = useRef(false)

    const [bodyIds, setBodyIds] = useState([])
    const divRefs = useRef({})
    const reqRef = useRef()
    
    useEffect(() => {
        const cw = window.innerWidth
        const ch = window.innerHeight

        Runner.run(runner.current, engine.current)

        const syncDOM = () => {
            const bodies = Composite.allBodies(engine.current.world)
            
            bodies.forEach(body => {

                const div = divRefs.current[body.id]
                if (div) {
                    const x = body.position.x
                    const y = body.position.y
                    const angle = body.angle

                    div.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`
                }
            })

            reqRef.current = requestAnimationFrame(syncDOM)
        }
        
        reqRef.current = requestAnimationFrame(syncDOM)

        return () => {
            Runner.stop(runner.current)
            Composite.clear(engine.current.world, false)
            cancelAnimationFrame(reqRef.current)
        }
    }, [])

    const handleMouseDown = (e) => {
        const bodies = Composite.allBodies(engine.current.world)
        isDrawing.current = true

        bodies.forEach(body => {
            if (body.id.toString().startsWith(`brush${props.playerId}`))
                body.isSensor = true
        })
        setBodyIds([]) 
        
    }

    const handleMouseUp = (e) => {
        isDrawing.current = false
    }

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return

        const radius = 15
        const ball = Bodies.circle(e.clientX, e.clientY, radius, {
            id: `brush${props.playerId}-${Date.now()}`,
            isStatic: true,
            restitution: 1.5,
            friction: 0.005
        })

        Composite.add(engine.current.world, [ball])
        setBodyIds(prev => [...prev, ball.id])
    }


    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ width: 'inherit', height: 'inherit'}}
        >
            {bodyIds.map(id => (
                <div
                    key={id}
                    ref={el => divRefs.current[id] = el}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'rgb(179, 255, 0)',
                        filter: 'drop-shadow(0 0 5px rgb(179, 255, 0))',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />
            ))}
        </div>
    )
}