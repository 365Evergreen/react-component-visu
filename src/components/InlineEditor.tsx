import React from 'react'

interface InlineEditorProps {enabled:boolean; children:React.ReactNode}

export const InlineEditor: React.FC<InlineEditorProps> = ({enabled, children})=>{
  // this wraps children and enables contentEditable on common text nodes via delegation
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(()=>{
    const root = rootRef.current
    if(!root) return
    const elements = root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,button,[data-text]')
    elements.forEach(el=>{
      ;(el as HTMLElement).contentEditable = enabled ? 'true' : 'false'
      if(enabled) (el as HTMLElement).classList.add('editable')
      else (el as HTMLElement).classList.remove('editable')
    })

    // attach click/blur handlers for selection and undo tracking
    const onClick = (e:Event)=>{
      const target = e.target as HTMLElement
      if(!target) return
      // find nearest editable parent
      const el = target.closest('h1,h2,h3,h4,h5,h6,p,button,[data-text]') as HTMLElement | null
      if(!el) return
      // ensure stable id
      if(!el.dataset.componentId) el.dataset.componentId = 'c_'+Math.floor(Math.random()*1e9).toString(36)
      // dispatch a selection event
      window.dispatchEvent(new CustomEvent('rcv:select',{detail:{id:el.dataset.componentId}}))
    }

    const onBlur = (e:Event)=>{
      const el = e.target as HTMLElement
      if(!el || !el.dataset.componentId) return
      const id = el.dataset.componentId
      const prev = el.dataset.prevContent || ''
      const next = el.innerHTML
      // push into undo stack via global event; UndoContext will add actual op
      window.dispatchEvent(new CustomEvent('rcv:edit',{detail:{id,prev,next,apply:()=>{ const t = document.querySelector('[data-component-id="'+id+'"]'); if(t) (t as HTMLElement).innerHTML = next }}}))
      el.dataset.prevContent = next
    }

    root.addEventListener('click', onClick)
    root.addEventListener('blur', onBlur, true)
    return ()=>{ root.removeEventListener('click', onClick); root.removeEventListener('blur', onBlur, true) }
  },[enabled, children])

  return <div ref={rootRef}>{children}</div>
}

export default InlineEditor
