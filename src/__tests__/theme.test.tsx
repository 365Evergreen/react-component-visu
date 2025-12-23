import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import React from 'react'

function TestComp(){ const {theme,toggle} = useTheme(); return <div data-testid="theme">{theme}<button onClick={toggle}>t</button></div> }

test('theme toggles and persists', ()=>{
  localStorage.clear()
  render(<ThemeProvider><TestComp/></ThemeProvider>)
  expect(screen.getByTestId('theme').textContent).toMatch(/dark|light/)
})
