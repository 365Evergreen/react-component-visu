import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '../components/Sidebar'
import React from 'react'

test('sidebar toggles collapse and stores state', async ()=>{
  localStorage.clear()
  const { getByText, findByText } = render(<Sidebar side="left">Content</Sidebar>)
  const btn = getByText('Collapse') as HTMLButtonElement
  expect(btn).toBeTruthy()
  fireEvent.click(btn)
  // after click, button text should be Open
  await findByText('Open')
  expect(JSON.parse(localStorage.getItem('rcv:sidebar:left')||'false')).toBe(true)
})
