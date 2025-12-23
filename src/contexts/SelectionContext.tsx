import React from 'react'

interface SelectionContextValue { selectedId:string | null; setSelectedId: (id:string|null)=>void }
const SelectionContext = React.createContext<SelectionContextValue | undefined>(undefined)

export const SelectionProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [selectedId,setSelectedId] = React.useState<string|null>(null)

  React.useEffect(()=>{
    const onChange = (e:any)=> setSelectedId(e.detail?.id || null)
    window.addEventListener('rcv:selection:changed', onChange as EventListener)
    return ()=> window.removeEventListener('rcv:selection:changed', onChange as EventListener)
  },[])

  return <SelectionContext.Provider value={{selectedId,setSelectedId}}>{children}</SelectionContext.Provider>
}

export function useSelection(){ const ctx = React.useContext(SelectionContext); if(!ctx) throw new Error('useSelection must be used inside SelectionProvider'); return ctx }
