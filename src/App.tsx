import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster, toast } from 'sonner';
import { ComponentLibrarySidebar } from '@/components/ComponentLibrarySidebar';
import { CanvasArea } from '@/components/CanvasArea';
import { PropertyPanel } from '@/components/PropertyPanel';
import { TopToolbar } from '@/components/TopToolbar';
import { CanvasComponent, ComponentType } from '@/types/component';
import { COMPONENT_LIBRARY } from '@/lib/component-library';

function App() {
  const [components, setComponents] = useKV<CanvasComponent[]>('canvas-components', []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useKV<any[]>('export-history', []);

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toaster position="top-right" theme="dark" />
      
      <TopToolbar 
        components={currentComponents}
        onExport={handleExport}
      />

      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrarySidebar onComponentSelect={handleAddComponent} />
        
        <CanvasArea
          components={currentComponents}
          selectedId={selectedId}
          onSelectComponent={setSelectedId}
          onDeleteComponent={handleDeleteComponent}
          onMoveComponent={handleMoveComponent}
          onAddComponentToContainer={handleAddComponentToContainer}
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