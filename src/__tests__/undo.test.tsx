import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../App'

test('undo/redo via toolbar buttons', async ()=>{
  localStorage.clear()
  const { getByText } = render(<App />)
  // enable editing
  const editBtn = getByText('Edit')
  fireEvent.click(editBtn)
  const p = screen.getByText('Some value')
  // simulate edit by changing innerHTML
  (p as HTMLElement).innerHTML = 'CHANGED'
  // blur to trigger handler
  fireEvent.blur(p)
  // click Undo toolbar button
  const undo = getByText('Undo')
  fireEvent.click(undo)
  expect(p.textContent).toBe('Some value')
  const redo = getByText('Redo')
  fireEvent.click(redo)
  expect(p.textContent).toBe('CHANGED')
})
