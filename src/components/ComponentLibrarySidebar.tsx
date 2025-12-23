import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PageLayoutPicker } from './PageLayoutPicker';
import { ThemeDesigner } from './ThemeDesigner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search16Regular, Box20Regular } from '@fluentui/react-icons';
import { COMPONENT_LIBRARY, CONTAINER_TYPES } from '@/lib/component-library';
import { ComponentType } from '@/types/component';

interface ComponentLibrarySidebarProps {
  onComponentSelect: (type: ComponentType) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ComponentLibrarySidebar({ onComponentSelect, collapsed = false, onToggleCollapse }: ComponentLibrarySidebarProps) {
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
    <div className={`transition-all duration-200 bg-card border-r border-border flex flex-col h-full ${collapsed ? 'w-12 min-w-[3rem]' : 'w-72'}`}>
      <div className="p-3 border-b border-border flex items-center gap-3">
        <button
          className="mr-2 p-1 rounded hover:bg-muted"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapse}
        >
          <span aria-hidden>{collapsed ? '»' : '«'}</span>
        </button>
        {!collapsed && <>
          <Box20Regular className="text-primary w-5 h-5" />
          <h2 className="font-semibold text-base">Tools</h2>
        </>}
        {!collapsed && (
          <div className="ml-auto flex gap-1">
            <button className={`px-3 py-1 rounded ${activeTab === 'components' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setActiveTab('components')}>Components</button>
            <button className={`px-3 py-1 rounded ${activeTab === 'layouts' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setActiveTab('layouts')}>Layouts</button>
            <button className={`px-3 py-1 rounded ${activeTab === 'theme' ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary/50'}`} onClick={() => setActiveTab('theme')}>Theme</button>
          </div>
        )}
      </div>

      {!collapsed && activeTab === 'components' && (
        <div className="p-3 flex-1 overflow-auto">
          <div className="relative mb-3">
            <Search16Regular className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                  <button
                    className="flex items-center gap-2 w-full text-left font-medium text-sm py-1 px-2 rounded hover:bg-muted"
                    onClick={() => toggleCategory(category)}
                  >
                    <span>{category}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{isExpanded ? '-' : '+'}</span>
                  </button>
                  {isExpanded && (
                    <div className="pl-4 space-y-1">
                      {components.map(comp => (
                        <button
                          key={comp.type}
                          className="w-full text-left px-2 py-1 rounded hover:bg-accent/30"
                          onClick={() => onComponentSelect(comp.type)}
                        >
                          <span className="font-mono text-xs mr-2">{comp.type}</span>
                          <span>{comp.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!collapsed && activeTab === 'layouts' && (
        <div className="p-3 flex-1 overflow-auto">
          <PageLayoutPicker />
        </div>
      )}
      {!collapsed && activeTab === 'theme' && (
        <div className="p-3 flex-1 overflow-auto">
          <ThemeDesigner />
        </div>
      )}
    </div>
  );
}