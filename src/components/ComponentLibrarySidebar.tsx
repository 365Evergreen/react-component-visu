import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlass, Package } from '@phosphor-icons/react';
import { COMPONENT_LIBRARY } from '@/lib/component-library';
import { ComponentType } from '@/types/component';

interface ComponentLibrarySidebarProps {
  onComponentSelect: (type: ComponentType) => void;
}

export function ComponentLibrarySidebar({ onComponentSelect }: ComponentLibrarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Array.from(new Set(COMPONENT_LIBRARY.map(c => c.category)));
  
  const filteredComponents = COMPONENT_LIBRARY.filter(comp =>
    comp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const componentsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredComponents.filter(c => c.category === category);
    return acc;
  }, {} as Record<string, typeof COMPONENT_LIBRARY>);

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Package className="text-primary" size={24} weight="duotone" />
          <h2 className="font-semibold text-lg">Components</h2>
        </div>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {categories.map(category => {
            const components = componentsByCategory[category];
            if (components.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="space-y-1">
                  {components.map(comp => (
                    <button
                      key={comp.type}
                      onClick={() => onComponentSelect(comp.type)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-xs font-medium text-primary">{comp.type[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{comp.type}</div>
                          <div className="text-xs text-muted-foreground truncate">{comp.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}