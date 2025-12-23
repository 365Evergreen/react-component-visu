<<<<<<< HEAD
import React from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Sidebar from './components/Sidebar'
import CanvasViewport from './components/CanvasViewport'
import InlineEditor from './components/InlineEditor'

import { UndoProvider } from './contexts/UndoContext'
import { SelectionProvider } from './contexts/SelectionContext'
import Inspector from './components/Inspector'

function EditorUI(){
  const {theme,toggle} = useTheme()
  const [editing,setEditing] = React.useState<boolean>(()=> !!(localStorage.getItem('rcv:editing')==='true'))
  React.useEffect(()=> localStorage.setItem('rcv:editing', String(editing)),[editing])

  // wire rcv global events to contexts
  React.useEffect(()=>{
    const onSelect = (e:Event & any)=>{
      const detail = e.detail
      window.dispatchEvent(new CustomEvent('rcv:selection:changed',{detail}))
    }
    // rcv:select events bubbled from inline editor will be handled by SelectionProvider via DOM event
    window.addEventListener('rcv:select', (e:any)=>{
      const ev = new CustomEvent('rcv:selection:changed', {detail:e.detail})
      window.dispatchEvent(ev)
    })
  },[])

  return (
    <UndoProvider>
    <SelectionProvider>
    <div className="app-shell">
      <Sidebar side="left">
        <div className="card">Component Library</div>
        <div className="card">
          <button className="btn">Add Card</button>
        </div>
      </Sidebar>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="toolbar"><h2 className="h1">Dashboard</h2></div>
          <div className="toolbar">
            <button className="btn" onClick={()=>toggle()}>{theme==='dark'?'Light':'Dark'}</button>
            <button className="btn" onClick={()=>setEditing(e=>!e)} style={{marginLeft:8}}>{editing? 'Stop Editing':'Edit'}</button>
            <button className="btn" onClick={()=> window.dispatchEvent(new CustomEvent('rcv:undo'))} style={{marginLeft:8}}>Undo</button>
            <button className="btn" onClick={()=> window.dispatchEvent(new CustomEvent('rcv:redo'))} style={{marginLeft:8}}>Redo</button>
          </div>
        </header>

        <CanvasViewport>
          <InlineEditor enabled={editing}>
            <section style={{width:900}}>
              <div className="card" data-component-id="metric-1"><h3>Metric 1</h3><p data-text>Some value</p></div>
              <div className="card" data-component-id="metric-2"><h3>Metric 2</h3><p data-text>Another value</p></div>
            </section>
          </InlineEditor>
        </CanvasViewport>
      </div>

      <Sidebar side="right">
        <Inspector />
      </Sidebar>
    </div>
    </SelectionProvider>
    </UndoProvider>
  )
}

export default function App(){
  return (
    <ThemeProvider>
      <EditorUI />
    </ThemeProvider>
  )
}
=======
import { useState, useEffect } from 'react';
import { getLayoutComponents } from '@/lib/layouts';
import { useKV } from '@github/spark/hooks';
import { Toaster, toast } from 'sonner';
import { ComponentLibrarySidebar } from '@/components/ComponentLibrarySidebar';
import { CanvasArea } from '@/components/CanvasArea';
import { PropertyPanel } from '@/components/PropertyPanel';
import { ComponentTreeView } from '@/components/ComponentTreeView';
import { TopToolbar } from '@/components/TopToolbar';
import { CanvasComponent, ComponentType } from '@/types/component';
import { COMPONENT_LIBRARY } from '@/lib/component-library';

function App() {
  const [components, setComponents] = useKV<CanvasComponent[]>('canvas-components', []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useKV<any[]>('export-history', []);
  const [pageLayout, setPageLayout] = useKV<string>('page-layout', 'landing');
  const [themeTokens, setThemeTokens] = useKV<Record<string,string>>('theme-tokens', {});
  const [previewComponents, setPreviewComponents] = useState<CanvasComponent[] | null>(null);

  // convenience alias for current components
  const currentComponents = components || [];

  const handleAddComponent = (type: ComponentType) => {
    const libraryItem = COMPONENT_LIBRARY.find(c => c.type === type);
    if (!libraryItem) return;

    const newComponent: CanvasComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: { ...libraryItem.defaultProps },
      children: [],
      events: [],
      styles: '',
    };

    setComponents(current => [...(current || []), newComponent]);
    setSelectedId(newComponent.id);
  };

  const handleUpdateComponent = (id: string, updates: Partial<CanvasComponent>) => {
    const updateRecursive = (comps: CanvasComponent[]): CanvasComponent[] => {
      return comps.map(comp => {
        if (comp.id === id) {
          return { ...comp, ...updates };
        }
        return {
          ...comp,
          children: updateRecursive(comp.children || [])
        };
      });
    };

    setComponents(current => updateRecursive(current || []));
  };

  const handleDeleteComponent = (id: string) => {
    const deleteRecursive = (comps: CanvasComponent[]): CanvasComponent[] => {
      return comps
        .filter(comp => comp.id !== id)
        .map(comp => ({
          ...comp,
          children: deleteRecursive(comp.children || [])
        }));
    };

    setComponents(current => deleteRecursive(current || []));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleMoveComponent = (componentId: string, targetId: string | null) => {
    if (componentId === targetId) {
      toast.error('Cannot nest a component inside itself');
      return;
    }

    const isDescendant = (parentId: string, childId: string, comps: CanvasComponent[]): boolean => {
      const findComponent = (id: string, components: CanvasComponent[]): CanvasComponent | null => {
        for (const comp of components) {
          if (comp.id === id) return comp;
          const found = findComponent(id, comp.children || []);
          if (found) return found;
        }
        return null;
      };

      const parent = findComponent(parentId, comps);
      if (!parent) return false;

      const checkChildren = (comp: CanvasComponent): boolean => {
        if (comp.id === childId) return true;
        return (comp.children || []).some(checkChildren);
      };

      return checkChildren(parent);
    };

    if (targetId && isDescendant(componentId, targetId, currentComponents)) {
      toast.error('Cannot nest a parent inside its own child');
      return;
    }

    let movedComponent: CanvasComponent | null = null;

    const removeComponent = (comps: CanvasComponent[]): CanvasComponent[] => {
      return comps
        .map(comp => {
          if (comp.id === componentId) {
            movedComponent = comp;
            return null;
          }
          return {
            ...comp,
            children: removeComponent(comp.children || [])
          };
        })
        .filter(Boolean) as CanvasComponent[];
    };

    const addToTarget = (comps: CanvasComponent[]): CanvasComponent[] => {
      if (!targetId) {
        return [...comps, movedComponent!];
      }
      
      return comps.map(comp => {
        if (comp.id === targetId) {
          return {
            ...comp,
            children: [...(comp.children || []), movedComponent!]
          };
        }
        return {
          ...comp,
          children: addToTarget(comp.children || [])
        };
      });
    };

    setComponents(current => {
      const withoutMoved = removeComponent(current || []);
      if (movedComponent) {
        const result = addToTarget(withoutMoved);
        
        if (!targetId) {
          toast.success(`${movedComponent.type} moved to root`);
        } else {
          const findComponent = (comps: CanvasComponent[], id: string): CanvasComponent | null => {
            for (const comp of comps) {
              if (comp.id === id) return comp;
              const found = findComponent(comp.children || [], id);
              if (found) return found;
            }
            return null;
          };
          
          const targetComponent = findComponent(result, targetId);
          if (targetComponent) {
            toast.success(`${movedComponent.type} nested inside ${targetComponent.type}`);
          }
        }
        
        return result;
      }
      return withoutMoved;
    });
  };

  const handleAddComponentToContainer = (type: ComponentType, targetId: string | null) => {
    const libraryItem = COMPONENT_LIBRARY.find(c => c.type === type);
    if (!libraryItem) return;

    const newComponent: CanvasComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: { ...libraryItem.defaultProps },
      children: [],
      events: [],
      styles: '',
    };

    if (!targetId) {
      setComponents(current => [...(current || []), newComponent]);
      toast.success(`${type} added to canvas`);
    } else {
      const addToTarget = (comps: CanvasComponent[]): CanvasComponent[] => {
        return comps.map(comp => {
          if (comp.id === targetId) {
            return {
              ...comp,
              children: [...(comp.children || []), newComponent]
            };
          }
          return {
            ...comp,
            children: addToTarget(comp.children || [])
          };
        });
      };

      setComponents(current => addToTarget(current || []));
      
      const findComponent = (comps: CanvasComponent[], id: string): CanvasComponent | null => {
        for (const comp of comps) {
          if (comp.id === id) return comp;
          const found = findComponent(comp.children || [], id);
          if (found) return found;
        }
        return null;
      };
      
      const targetComponent = findComponent(currentComponents, targetId);
      if (targetComponent) {
        toast.success(`${type} nested inside ${targetComponent.type}`);
      }
    }
    
    setSelectedId(newComponent.id);
  };

  const handleExport = (config: any) => {
    setExportHistory(current => [...(current || []), { ...config, timestamp: Date.now() }]);
  };

  const findComponent = (comps: CanvasComponent[], id: string | null): CanvasComponent | null => {
    if (!id) return null;
    
    for (const comp of comps) {
      if (comp.id === id) return comp;
      const found = findComponent(comp.children || [], id);
      if (found) return found;
    }
    return null;
  };

  const selectedComponent = findComponent(currentComponents, selectedId);

  useEffect(() => {
    const onLayout = (e: any) => {
      const detail = e.detail;

      // If event provides components (from preview/apply), accept them
      if (Array.isArray(detail)) {
        setComponents(detail as CanvasComponent[]);
        setPreviewComponents(null);
        setSelectedId(null);
        toast.success('Layout applied');
        return;
      }

      // else treat as id and apply
      const id = detail as string;
      const layoutComps = getLayoutComponents(id);

      if (layoutComps && layoutComps.length > 0) {
        setComponents(layoutComps);
        setPageLayout(id);
        setSelectedId(null);
        toast.success(`Layout applied: ${id}`);
      } else {
        setPageLayout(id);
        toast.success(`Layout set to ${id}`);
      }
    };

    const onPreview = (e: any) => {
      const comps = e.detail as CanvasComponent[];
      setPreviewComponents(comps || null);
      toast('Previewing layout', { icon: '👁️' });
    };

    const onTheme = (e: any) => {
      const tokens = e.detail as Record<string,string>;
      setThemeTokens(tokens);
      // re-apply to document root as a safety
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        Object.entries(tokens || {}).forEach(([k, v]) => {
          if (v) root.style.setProperty(k, v);
        });
      }
      toast.success('Theme updated');
    };

    window.addEventListener('spark:apply-layout', onLayout as EventListener);
    window.addEventListener('spark:preview-layout', onPreview as EventListener);
    window.addEventListener('spark:theme-change', onTheme as EventListener);

    return () => {
      window.removeEventListener('spark:apply-layout', onLayout as EventListener);
      window.removeEventListener('spark:preview-layout', onPreview as EventListener);
      window.removeEventListener('spark:theme-change', onTheme as EventListener);
      setPreviewComponents(null);
    };
  }, [setPageLayout, setThemeTokens]);



  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toaster position="top-right" theme="dark" />
      
      <TopToolbar 
        components={currentComponents}
        onExport={handleExport}
      />

      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrarySidebar onComponentSelect={handleAddComponent} />
        
        <div className="flex-1 relative">
          {previewComponents && (
            <div className="absolute right-4 top-4 z-20 bg-card p-3 rounded shadow-lg border border-border flex gap-2 items-center">
              <div className="text-sm">Preview active</div>
              <button className="px-2 py-1 rounded bg-primary text-primary-foreground text-sm" onClick={() => {
                setComponents(previewComponents);
                setPreviewComponents(null);
                toast.success('Layout applied');
              }}>Apply</button>
              <button className="px-2 py-1 rounded bg-muted text-sm" onClick={() => setPreviewComponents(null)}>Discard</button>
            </div>
          )}

          <CanvasArea
            components={previewComponents || currentComponents}
            selectedId={selectedId}
            onSelectComponent={setSelectedId}
            onDeleteComponent={handleDeleteComponent}
            onMoveComponent={handleMoveComponent}
            onAddComponentToContainer={handleAddComponentToContainer}
          />
        </div>

        <ComponentTreeView
          components={currentComponents}
          selectedId={selectedId}
          onSelectComponent={setSelectedId}
          onDeleteComponent={handleDeleteComponent}
        />

        <PropertyPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
        />
      </div>
    </div>
  );
}

export default App;
>>>>>>> origin/main
