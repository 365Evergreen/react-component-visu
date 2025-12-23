import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PageLayoutPicker } from './PageLayoutPicker';
import { ThemeDesigner } from './ThemeDesigner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, Package } from '@phosphor-icons/react';
import { COMPONENT_LIBRARY, CONTAINER_TYPES } from '@/lib/component-library';
import { ComponentType } from '@/types/component';

interface ComponentLibrarySidebarProps {
  onComponentSelect: (type: ComponentType) => void;
}

export function ComponentLibrarySidebar({ onComponentSelect }: ComponentLibrarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'components'|'layouts'|'theme'>('components');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const categories = Array.from(new Set(COMPONENT_LIBRARY.map(c => c.category)));
  
  const filteredComponents = COMPONENT_LIBRARY.filter(comp =>
    comp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const componentsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredComponents.filter(c => c.category === category);
    return acc;
  }, {} as Record<string, typeof COMPONENT_LIBRARY>);

  function toggleCategory(cat: string) {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  }

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center gap-3">
        <Package className="text-primary" size={20} weight="duotone" />
        <h2 className="font-semibold text-base">Tools</h2>
        <div className="ml-auto flex gap-1">
          <button className={`px-3 py-1 rounded ${activeTab === 'components' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setActiveTab('components')}>Components</button>
          <button className={`px-3 py-1 rounded ${activeTab === 'layouts' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setActiveTab('layouts')}>Layouts</button>
          <button className={`px-3 py-1 rounded ${activeTab === 'theme' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setActiveTab('theme')}>Theme</button>
        </div>
      </div>

      {activeTab === 'components' && (
        <div className="p-3 flex-1 overflow-auto">
          <div className="relative mb-3">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="space-y-2">
            {categories.map(category => {
              const components = componentsByCategory[category];
              if (components.length === 0) return null;

              const isExpanded = !!expandedCategories[category];

              return (
                <div key={category}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category)}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</div>
                    <div className="text-xs text-muted-foreground">{isExpanded ? '▾' : '▸'}</div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-1 mt-1">
                      {components.map(comp => {
                        const isContainer = CONTAINER_TYPES.includes(comp.type as any);
                        return (
                          <button
                            key={comp.type}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('componentType', comp.type);
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => onComponentSelect(comp.type)}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors group cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <span className="text-xs font-medium text-primary">{comp.type[0]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm flex items-center gap-2">
                                  {comp.type}
                                  {isContainer && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-success/10 text-success border-success/30">
                                      Container
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">{comp.description}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'layouts' && (
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <div className="p-2">
              <p className="text-xs text-muted-foreground">Pick a page layout for full-page design</p>
            </div>
            <div className="border-t border-border">
              {/* Lazy load picker to keep bundle small */}
              <PageLayoutPicker onLayoutSelect={(id) => {
                // Placeholder: emit event for App to handle
                const ev = new CustomEvent('spark:select-layout', { detail: id });
                window.dispatchEvent(ev);
              }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <p className="text-xs text-muted-foreground mb-2">Adjust the base theme tokens (applies live)</p>
            <ThemeDesigner onChange={(tokens) => {
              // Event so App or other systems can pick up theme changes
              const ev = new CustomEvent('spark:theme-change', { detail: tokens });
              window.dispatchEvent(ev);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}