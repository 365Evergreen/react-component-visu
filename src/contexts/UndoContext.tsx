import React from 'react'

type EditOp = {id:string, prev:string, next:string, apply:()=>void}

interface UndoContextValue { push: (op:EditOp)=>void; undo:()=>void; redo:()=>void; canUndo:boolean; canRedo:boolean }

const UndoContext = React.createContext<UndoContextValue | undefined>(undefined)

export const UndoProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [undoStack, setUndoStack] = React.useState<EditOp[]>([])
  const [redoStack, setRedoStack] = React.useState<EditOp[]>([])

  const push = (op:EditOp)=>{
    setUndoStack(s=>[...s, op])
    setRedoStack([])
  }
  const undo = ()=>{
    setUndoStack(s=>{
      if(s.length===0) return s
      const op = s[s.length-1]
      // apply prev
      const t = document.querySelector('[data-component-id="'+op.id+'"]') as HTMLElement | null
      if(t) t.innerHTML = op.prev
      setRedoStack(r=>[...r, op])
      return s.slice(0,-1)
    })
  }
  const redo = ()=>{
    setRedoStack(s=>{
      if(s.length===0) return s
      const op = s[s.length-1]
      const t = document.querySelector('[data-component-id="'+op.id+'"]') as HTMLElement | null
      if(t) t.innerHTML = op.next
      setUndoStack(u=>[...u, op])
      return s.slice(0,-1)
    })
  }

  // expose global events for simple dispatch from InlineEditor
  React.useEffect(()=>{
    const onEdit = (e:any)=>{
      const d = e.detail
      // attach data-component-id to element if needed
      const el = document.querySelector('[data-component-id="'+d.id+'"]') as HTMLElement | null
      if(el) push({id:d.id, prev:d.prev, next:d.next, apply:()=>{ el.innerHTML = d.next }})
    }
    const onUndo = ()=> undo()
    const onRedo = ()=> redo()
    window.addEventListener('rcv:edit', onEdit as EventListener)
    window.addEventListener('rcv:undo', onUndo as EventListener)
    window.addEventListener('rcv:redo', onRedo as EventListener)
    return ()=>{
      window.removeEventListener('rcv:edit', onEdit as EventListener)
      window.removeEventListener('rcv:undo', onUndo as EventListener)
      window.removeEventListener('rcv:redo', onRedo as EventListener)
    }
  },[])


  return <UndoContext.Provider value={{push,undo,redo,canUndo:undoStack.length>0,canRedo:redoStack.length>0}}>{children}</UndoContext.Provider>
}

export function useUndo(){ const ctx = React.useContext(UndoContext); if(!ctx) throw new Error('useUndo must be used inside UndoProvider'); return ctx }
