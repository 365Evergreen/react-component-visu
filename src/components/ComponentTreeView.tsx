import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  CaretDown, 
  CaretRight,
  Trash,
  Package,
} from '@phosphor-icons/react';
import { CanvasComponent } from '@/types/component';
import { CONTAINER_TYPES } from '@/lib/component-library';
import { cn } from '@/lib/utils';

interface ComponentTreeViewProps {
  components: CanvasComponent[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
}

export function ComponentTreeView({ 
  components, 
  selectedId,
  onSelectComponent,
  onDeleteComponent
}: ComponentTreeViewProps) {
  return (
    <div className="w-64 bg-card border-l border-border flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Package size={18} weight="duotone" className="text-primary" />
          <h2 className="font-semibold text-sm">Component Tree</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {components.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Package size={32} weight="duotone" className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground mb-1">No components yet</p>
              <p className="text-xs text-muted-foreground">Add components to see the tree</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {components.map((component) => (
                <TreeNode
                  key={component.id}
                  component={component}
                  isSelected={selectedId === component.id}
                  selectedId={selectedId}
                  onSelect={onSelectComponent}
                  onDelete={onDeleteComponent}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface TreeNodeProps {
  component: CanvasComponent;
  isSelected: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  depth: number;
}

function TreeNode({ 
  component, 
  isSelected,
  selectedId,
  onSelect, 
  onDelete,
  depth 
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = component.children && component.children.length > 0;
  const isContainer = CONTAINER_TYPES.includes(component.type as any);

  const getComponentIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'Button': '🔘',
      'Input': '📝',
      'Card': '🗂️',
      'div': '📦',
      'section': '📋',
      'header': '🎯',
      'footer': '⬇️',
      'main': '🏠',
      'article': '📄',
      'nav': '🧭',
      'aside': '📌',
      'h1': 'H1',
      'h2': 'H2',
      'h3': 'H3',
      'p': '¶',
      'span': '⊕',
      'img': '🖼️',
      'Checkbox': '☑️',
      'Label': '🏷️',
      'Switch': '🔄',
      'Textarea': '📄',
      'Badge': '🔖',
      'Alert': '⚠️',
      'Dialog': '💬',
      'Select': '🔽',
      'Separator': '➖',
      'Progress': '📊',
      'Slider': '🎚️',
      'Tooltip': '💡',
      'Avatar': '👤',
      'Tabs': '📑',
      'Accordion': '📂',
      'Table': '📊',
      'ScrollArea': '📜',
    };
    return iconMap[type] || '⚡';
  };

  return (
    <div>
      <div
        onClick={() => onSelect(component.id)}
        className={cn(
          'group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-all',
          'hover:bg-secondary/50',
          isSelected && 'bg-primary/20 hover:bg-primary/25 ring-1 ring-primary/40'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center hover:bg-secondary rounded transition-colors"
          >
            {isExpanded ? (
              <CaretDown size={12} weight="bold" className="text-foreground" />
            ) : (
              <CaretRight size={12} weight="bold" className="text-foreground" />
            )}
          </button>
        ) : (
          <div className="w-4 flex-shrink-0" />
        )}

        <span className="text-sm flex-shrink-0">{getComponentIcon(component.type)}</span>

        <span className={cn(
          'text-sm font-medium flex-1 truncate',
          isSelected ? 'text-foreground' : 'text-foreground/80'
        )}>
          {component.type}
        </span>

        {isContainer && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success font-medium flex-shrink-0">
            {component.children?.length || 0}
          </span>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            className="p-1 hover:bg-destructive/20 rounded transition-colors"
            title="Delete component"
          >
            <Trash size={14} className="text-destructive" />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-0.5">
          {component.children!.map((child) => (
            <TreeNode
              key={child.id}
              component={child}
              isSelected={selectedId === child.id}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
