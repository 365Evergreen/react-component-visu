import React from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Sidebar from './components/Sidebar'
import CanvasViewport from './components/CanvasViewport'
import InlineEditor from './components/InlineEditor'

import { UndoProvider } from './contexts/UndoContext'
import { SelectionProvider } from './contexts/SelectionContext'
import Inspector from './components/Inspector'

function EditorUI(){
  const {theme,toggle} = useTheme()
  const [editing,setEditing] = React.useState<boolean>(()=> !!(localStorage.getItem('rcv:editing')==='true'))
  React.useEffect(()=> localStorage.setItem('rcv:editing', String(editing)),[editing])

  // wire rcv global events to contexts
  React.useEffect(()=>{
    const onSelect = (e:Event & any)=>{
      const detail = e.detail
      window.dispatchEvent(new CustomEvent('rcv:selection:changed',{detail}))
    }
    // rcv:select events bubbled from inline editor will be handled by SelectionProvider via DOM event
    window.addEventListener('rcv:select', (e:any)=>{
      const ev = new CustomEvent('rcv:selection:changed', {detail:e.detail})
      window.dispatchEvent(ev)
    })
  },[])

  return (
    <UndoProvider>
    <SelectionProvider>
    <div className="app-shell">
      <Sidebar side="left">
        <div className="card">Component Library</div>
        <div className="card">
          <button className="btn">Add Card</button>
        </div>
      </Sidebar>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="toolbar"><h2 className="h1">Dashboard</h2></div>
          <div className="toolbar">
            <button className="btn" onClick={()=>toggle()}>{theme==='dark'?'Light':'Dark'}</button>
            <button className="btn" onClick={()=>setEditing(e=>!e)} style={{marginLeft:8}}>{editing? 'Stop Editing':'Edit'}</button>
            <button className="btn" onClick={()=> window.dispatchEvent(new CustomEvent('rcv:undo'))} style={{marginLeft:8}}>Undo</button>
            <button className="btn" onClick={()=> window.dispatchEvent(new CustomEvent('rcv:redo'))} style={{marginLeft:8}}>Redo</button>
          </div>
        </header>

        <CanvasViewport>
          <InlineEditor enabled={editing}>
            <section style={{width:900}}>
              <div className="card" data-component-id="metric-1"><h3>Metric 1</h3><p data-text>Some value</p></div>
              <div className="card" data-component-id="metric-2"><h3>Metric 2</h3><p data-text>Another value</p></div>
            </section>
          </InlineEditor>
        </CanvasViewport>
      </div>

      <Sidebar side="right">
        <Inspector />
      </Sidebar>
    </div>
    </SelectionProvider>
    </UndoProvider>
  )
}

export default function App(){
  return (
    <ThemeProvider>
      <EditorUI />
    </ThemeProvider>
  )
}
