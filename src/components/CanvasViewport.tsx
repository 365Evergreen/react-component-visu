import React from 'react'

interface CanvasViewportProps {children?:React.ReactNode}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({children})=>{
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  const [scale,setScale] = React.useState<number>(()=> Number(localStorage.getItem('rcv:scale')) || 1)

  React.useEffect(()=>{ localStorage.setItem('rcv:scale', String(scale)); if(innerRef.current) innerRef.current.style.transform = `scale(${scale})` },[scale])

  // keyboard shortcuts
  React.useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{
      const isCmd = e.ctrlKey || e.metaKey
      if(!isCmd) return
      if(e.key === '+' || e.key === '='){ e.preventDefault(); setScale(s=>Math.min(3, s+0.1)) }
      if(e.key === '-') { e.preventDefault(); setScale(s=>Math.max(0.25, s-0.1)) }
      if(e.key === '0'){ e.preventDefault(); setScale(1) }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  // wheel zoom (ctrl held)
  React.useEffect(()=>{
    const el = containerRef.current
    if(!el) return
    const onWheel = (e:WheelEvent)=>{ if(e.ctrlKey || e.metaKey){ e.preventDefault(); setScale(s=>Math.max(0.25, Math.min(3, s - Math.sign(e.deltaY)*0.05))) } }
    el.addEventListener('wheel', onWheel, {passive:false})
    return ()=> el.removeEventListener('wheel', onWheel as any)
  },[])

  // simple middle mouse pan
  React.useEffect(()=>{
    const el = containerRef.current
    if(!el) return
    let dragging=false,startX=0,startY=0,origLeft=0,origTop=0
    const onDown = (ev:MouseEvent)=>{ if(ev.button===1){ dragging=true; startX=ev.clientX; startY=ev.clientY; origLeft=el.scrollLeft; origTop=el.scrollTop; ev.preventDefault() } }
    const onMove = (ev:MouseEvent)=>{ if(dragging){ el.scrollLeft = origLeft - (ev.clientX-startX); el.scrollTop = origTop - (ev.clientY-startY) } }
    const onUp = ()=> dragging=false
    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return ()=>{ el.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  },[])

  return (
    <div ref={containerRef} className="canvas-area" role="region" aria-label="canvas">
      <div ref={innerRef} className="canvas-inner">{children}</div>
    </div>
  )
}

export default CanvasViewport
