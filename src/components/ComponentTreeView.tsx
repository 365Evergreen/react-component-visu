import { useState } from 'react';
import { CanvasComponent } from '@/types/component';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tree, 
  CaretRight, 
  CaretDown, 
  Trash,
  Square,
  SquaresFour,
  TextT,
  Image as ImageIcon,
  ListBullets,
  Article,
  Crosshair,
  ArrowsOutCardinal,
  Package
} from '@phosphor-icons/react';
import { CONTAINER_TYPES } from '@/lib/component-library';

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
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Tree className="text-primary" size={24} weight="duotone" />
          <h2 className="font-semibold text-lg">Component Tree</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Navigate nested structures
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {components.length === 0 ? (
            <div className="p-8 text-center">
              <Tree className="mx-auto mb-2 text-muted-foreground/30" size={48} weight="duotone" />
              <p className="text-sm text-muted-foreground">
                No components yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Add components to see the tree
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {components.map((component) => (
                <TreeNode
                  key={component.id}
                  component={component}
                  isSelected={selectedId === component.id}
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
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  depth: number;
}

function TreeNode({ 
  component, 
  isSelected, 
  onSelect, 
  onDelete,
  depth 
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = component.children && component.children.length > 0;
  const isContainer = CONTAINER_TYPES.includes(component.type as any);

  const getComponentIcon = (type: string) => {
    const iconProps = { size: 16, weight: "duotone" as const };
    
    switch(type) {
      case 'Button':
        return <Square {...iconProps} />;
      case 'Card':
        return <SquaresFour {...iconProps} />;
      case 'div':
      case 'section':
      case 'header':
      case 'footer':
      case 'main':
      case 'article':
        return <Package {...iconProps} />;
      case 'Input':
      case 'Textarea':
      case 'Select':
        return <TextT {...iconProps} />;
      case 'img':
        return <ImageIcon {...iconProps} />;
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'Label':
      case 'span':
        return <Article {...iconProps} />;
      case 'nav':
      case 'aside':
        return <ListBullets {...iconProps} />;
      default:
        return <Crosshair {...iconProps} />;
    }
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

        <span className="text-muted-foreground flex-shrink-0">
          {getComponentIcon(component.type)}
        </span>

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
              isSelected={isSelected}
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
