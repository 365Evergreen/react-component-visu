import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
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
    setComponents(current => 
      (current || []).map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(current => (current || []).filter(comp => comp.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleExport = (config: any) => {
    setExportHistory(current => [...(current || []), { ...config, timestamp: Date.now() }]);
  };

  const selectedComponent = currentComponents.find(c => c.id === selectedId) || null;

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