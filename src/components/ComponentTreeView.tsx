import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Package,
  CaretRight, 
  CaretDown, 
  Trash,
} from '@phosphor-icons/react';
import { CONTAINER_TYPES } from '@/lib/component-library';
import { CanvasComponent } from '@/types/component';

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
  onDeleteComponent,
}: ComponentTreeViewProps) {
  return (
    <div className="w-64 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Package size={18} className="text-primary" />
          <h3 className="font-semibold text-sm">Component Tree</h3>
        </div>
        {components.length === 0 ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              No components yet. Add components from the library to get started.
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <div className="space-y-1">
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
          </div>
        )}
      </div>
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
  selectedId,
  isSelected,
  onSelect,
  onDelete,
  depth,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = component.children && component.children.length > 0;

  const iconMap: Record<string, string> = {
    'Button': '🔘',
    'Input': '📝',
    'Card': '🃏',
    'div': '📦',
    'section': '📄',
    'header': '🎯',
    'footer': '📍',
    'main': '🏠',
    'article': '📰',
    'nav': '🧭',
    'aside': '🚪',
    'p': '¶',
    'h1': 'H1',
    'h2': 'H2',
    'h3': 'H3',
    'span': '⊕',
    'Label': '🏷️',
    'Checkbox': '☑️',
    'Switch': '🔄',
    'Select': '🔽',
    'Textarea': '📃',
    'Badge': '🔖',
    'Alert': '⚠️',
    'Dialog': '🗨️',
    'Separator': '➖',
    'Progress': '📊',
    'Slider': '🎚️',
    'Table': '📋',
    'Tabs': '📑',
    'Avatar': '👤',
    'Accordion': '▼',
    'ScrollArea': '📜',
    'Tooltip': '💬',
  };

  const isContainer = CONTAINER_TYPES.includes(component.type as any);

  return (
    <div>
      <div
        onClick={() => onSelect(component.id)}
        className={`
          group flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-accent/50 transition-colors
          ${isSelected ? 'bg-accent text-accent-foreground' : ''}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="hover:bg-primary/10 rounded p-0.5 transition-colors"
          >
            {isExpanded ? (
              <CaretDown size={14} weight="bold" />
            ) : (
              <CaretRight size={14} weight="bold" />
            )}
          </button>
        ) : (
          <div className="w-[22px]" />
        )}
        <span className="text-sm mr-1">{iconMap[component.type] || '📦'}</span>
        <span className="text-xs font-medium flex-1 truncate">
          {component.type}
        </span>
        {isContainer && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success">
            container
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component.id);
          }}
          className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive p-1 rounded transition-all"
          title="Delete component"
        >
          <Trash size={12} />
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-0.5">
          {component.children.map((child) => (
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
