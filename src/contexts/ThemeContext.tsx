import React, {createContext, useContext, useEffect, useState} from 'react'

type Theme = 'dark' | 'light'
interface ThemeContextValue {theme:Theme; toggle:()=>void; set: (t:Theme)=>void}
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [theme,setTheme] = useState<Theme>(()=> (localStorage.getItem('rcv:theme') as Theme) || 'dark')
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('rcv:theme', theme) },[theme])
  const toggle = ()=> setTheme(t=> t==='dark'?'light':'dark')
  return <ThemeContext.Provider value={{theme,toggle,set:setTheme}}>{children}</ThemeContext.Provider>
}

export function useTheme(){ const ctx = useContext(ThemeContext); if(!ctx) throw new Error('useTheme must be used inside ThemeProvider'); return ctx }
