// Collapsible sidebar state and theme mode
const getInitialSidebarState = (key: string, fallback = true) => {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored === null ? fallback : stored === 'true';
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme-mode') || 'light';
};
import { useState, useEffect } from 'react';
import { getLayoutComponents } from '@/lib/layouts';
import { Toaster, toast } from 'sonner';

import { ComponentLibrarySidebar } from '@/components/ComponentLibrarySidebar';
import { CanvasArea } from '@/components/CanvasArea';
import { PropertyPanel } from '@/components/PropertyPanel';
import { ComponentTreeView } from '@/components/ComponentTreeView';
import { TopToolbar } from '@/components/TopToolbar';
import { CanvasComponent, ComponentType } from '@/types/component';
import { COMPONENT_LIBRARY } from '@/lib/component-library';
import { ThemeDesigner } from './components/ThemeDesigner';
import { PageLayoutPicker } from './components/PageLayoutPicker';


function App() {
  // Collapsible right sidebar state
  const [rightSidebarOpen, setRightSidebarOpen] = useState(() => getInitialSidebarState('rightSidebarOpen', true));
  // Theme mode
  const [theme, setTheme] = useState(() => getInitialTheme());

  // Sidebar selection state
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>('theme-generator');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme-mode', theme);
  }, [theme]);
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [pageLayout, setPageLayout] = useState<string>("landing");
  const [themeTokens, setThemeTokens] = useState<Record<string, string>>({});
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
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar in a single <aside> */}
        <aside className="w-56 border-r bg-muted/40 h-full">
          <ComponentLibrarySidebar
            selected={selectedSidebarItem}
            onSelect={setSelectedSidebarItem}
          />
        </aside>
        {/* Main content area */}
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
          {/* Main content area based on sidebar selection */}
          {selectedSidebarItem === 'theme-generator' && (
            <div className="p-6">
              <ThemeDesigner />
            </div>
          )}
          {selectedSidebarItem === 'page-layouts' && (
            <div className="p-6">
              <PageLayoutPicker />
            </div>
          )}
          {/* If a component type is selected, show the canvas */}
          {COMPONENT_LIBRARY.some(c => c.type === selectedSidebarItem) && (
            <CanvasArea
              components={previewComponents || currentComponents}
              selectedId={selectedId}
              onSelectComponent={setSelectedId}
              onDeleteComponent={handleDeleteComponent}
              onMoveComponent={handleMoveComponent}
              onAddComponentToContainer={handleAddComponentToContainer}
            />
          )}
        </div>
        {/* Collapsible Right Sidebar */}
        <PropertyPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
          collapsed={!rightSidebarOpen}
          onToggleCollapse={() => {
            setRightSidebarOpen(v => {
              localStorage.setItem('rightSidebarOpen', (!v).toString());
              return !v;
            });
          }}
        />
      </div>
    </div>
  );
}

export default App;