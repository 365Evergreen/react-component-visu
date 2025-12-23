import React from 'react'

interface SidebarProps {side:'left'|'right'; collapsed?:boolean; onToggle?:(collapsed:boolean)=>void; children?:React.ReactNode}

export const Sidebar: React.FC<SidebarProps> = ({side,collapsed=false,onToggle,children})=>{
  const key = `rcv:sidebar:${side}`
  const [isCollapsed,setCollapsed] = React.useState<boolean>(()=>{
    const v = localStorage.getItem(key); return v? JSON.parse(v) : collapsed
  })
  React.useEffect(()=>{ localStorage.setItem(key, JSON.stringify(isCollapsed)) },[isCollapsed])
  return (
    <aside className={`sidebar ${isCollapsed? 'collapsed':''}`} aria-label={`${side} sidebar`}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <strong>{side}</strong>
        <button onClick={()=>{ setCollapsed(s=>{ const next=!s; onToggle?.(next); return next })}} aria-pressed={isCollapsed} className="btn">{isCollapsed? 'Open':'Collapse'}</button>
      </div>
      <div>{children}</div>
    </aside>
  )
}

export default Sidebar
