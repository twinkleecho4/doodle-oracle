import { useEffect, useRef } from 'react'

type Point = {
  x: number
  y: number
}

type DrawingCanvasProps = {
  onDrawingStart: () => void
}

type DrawLayerOptions = {
  color: string
  width: number
  glow: number
  opacity?: number
}

function DrawingCanvas({ onDrawingStart }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointsRef = useRef<Point[]>([])
  const isDrawingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    resizeCanvas()

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(canvas)

    return () => observer.disconnect()
  }, [])

  const getPoint = (event: PointerEvent): Point => {
    const canvas = canvasRef.current

    if (!canvas) {
      return { x: 0, y: 0 }
    }

    const rect = canvas.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const drawCurve = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const points = pointsRef.current

    if (points.length === 0) return

    const rect = canvas.getBoundingClientRect()

    ctx.clearRect(0, 0, rect.width, rect.height)

    if (points.length === 1) {
      const point = points[0]

      ctx.save()

      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)

      ctx.fillStyle = '#6047ff'
      ctx.shadowColor = '#ff4f91'
      ctx.shadowBlur = 8

      ctx.fill()

      ctx.restore()

      return
    }

    const drawLayer = ({
      color,
      width,
      glow,
      opacity = 1,
    }: DrawLayerOptions) => {
      ctx.save()

      ctx.beginPath()

      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length - 1; i++) {
        const current = points[i]
        const next = points[i + 1]

        const middleX = (current.x + next.x) / 2
        const middleY = (current.y + next.y) / 2

        ctx.quadraticCurveTo(
          current.x,
          current.y,
          middleX,
          middleY
        )
      }

      const last = points[points.length - 1]
      const previous = points[points.length - 2]

      ctx.quadraticCurveTo(
        previous.x,
        previous.y,
        last.x,
        last.y
      )

      ctx.strokeStyle = color
      ctx.globalAlpha = opacity
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (glow > 0) {
        ctx.shadowColor = color
        ctx.shadowBlur = glow
      }

      ctx.stroke()

      ctx.restore()
    }

    drawLayer({
      color: '#ff4f91',
      width: 9,
      glow: 9,
      opacity: 0.35,
    })

    drawLayer({
      color: '#6047ff',
      width: 4,
      glow: 4,
    })

    drawLayer({
      color: '#ffffff',
      width: 1.2,
      glow: 0,
    })
  }

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current

    if (!canvas) return

    isDrawingRef.current = true

    onDrawingStart()

    const point = getPoint(event.nativeEvent)

    pointsRef.current = [point]

    canvas.setPointerCapture(event.pointerId)

    drawCurve()
  }

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return

    const nativeEvent = event.nativeEvent

    const events = nativeEvent.getCoalescedEvents
      ? nativeEvent.getCoalescedEvents()
      : [nativeEvent]

    events.forEach((moveEvent) => {
      const point = getPoint(moveEvent)

      pointsRef.current.push(point)
    })

    drawCurve()
  }

  const stopDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current

    if (!canvas) return

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }

    isDrawingRef.current = false
  }

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
    />
  )
}

export default DrawingCanvas
