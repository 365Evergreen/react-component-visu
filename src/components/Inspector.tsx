import React from 'react'
import { useSelection } from '../contexts/SelectionContext'
import { useUndo } from '../contexts/UndoContext'

export const Inspector: React.FC = ()=>{
  const {selectedId} = useSelection()
  const [text, setText] = React.useState('')
  const undo = useUndo()

  React.useEffect(()=>{
    if(!selectedId){ setText(''); return }
    const el = document.querySelector('[data-component-id="'+selectedId+'"]') as HTMLElement | null
    setText(el?.innerText || '')
  },[selectedId])

  function applyText(){
    if(!selectedId) return
    const el = document.querySelector('[data-component-id="'+selectedId+'"]') as HTMLElement | null
    if(!el) return
    const prev = el.innerHTML
    el.innerText = text
    const next = el.innerHTML
    undo.push({id:selectedId, prev, next, apply:()=>{ const t = document.querySelector('[data-component-id="'+selectedId+'"]'); if(t) (t as HTMLElement).innerHTML = next }})
  }

  if(!selectedId) return <div className="card">No selection</div>
  return (
    <div className="card">
      <div style={{marginBottom:8}}><strong>Inspector</strong></div>
      <label style={{display:'block',fontSize:12,color:'var(--muted)'}}>Text</label>
      <textarea value={text} onChange={e=>setText(e.target.value)} style={{width:'100%',height:100}} />
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <button className="btn" onClick={applyText}>Apply</button>
        <button className="btn" onClick={()=>undo.undo()}>Undo</button>
        <button className="btn" onClick={()=>undo.redo()}>Redo</button>
      </div>
    </div>
  )
}

export default Inspector
