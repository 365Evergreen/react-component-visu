import { render, screen } from '@testing-library/react'
import Sidebar from '../components/Sidebar'
import React from 'react'

test('sidebar toggles collapse and stores state', ()=>{
  localStorage.clear()
  const { getByText } = render(<Sidebar side="left">Content</Sidebar>)
  const btn = getByText('Collapse') as HTMLButtonElement
  expect(btn).toBeTruthy()
  btn.click()
  // after click, button text should be Open
  expect(getByText('Open')).toBeTruthy()
  expect(JSON.parse(localStorage.getItem('rcv:sidebar:left')||'false')).toBe(true)
})
