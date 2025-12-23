import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../App'

test('undo/redo via toolbar buttons', async ()=>{
  localStorage.clear()
  const { getByText } = render(<App />)
  // enable editing
  const editBtn = getByText('Edit')
  fireEvent.click(editBtn)
  const p = screen.getByText('Some value') as HTMLElement
  // simulate inline edit by dispatching rcv:edit (avoid relying on contentEditable timing)
  p.dataset.componentId = 'c_test'
  const prev = p.innerHTML
  const next = 'CHANGED'
  // simulate real usage: element is already updated before rcv:edit is dispatched
  p.innerHTML = next
  window.dispatchEvent(new CustomEvent('rcv:edit',{detail:{id:'c_test',prev,next,apply:()=>{ p.innerHTML = next }}}))

  // click Undo toolbar button
  const undo = getByText('Undo')
  fireEvent.click(undo)
  // undo is async due to setState; wait for DOM update
  await screen.findByText('Some value')
  const redo = getByText('Redo')
  fireEvent.click(redo)
  await screen.findByText('CHANGED')
})
