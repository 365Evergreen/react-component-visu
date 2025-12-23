import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-a
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
  CaretDown, 
  Square,
  TextT,
  ListBullets,
  CaretDown, 
  Packag
  Eye,
interface 
  selectedId: string | null;
  onDeleteComponent: (id: string) => void;

  components, 
  onSelectComponent,
}: ComponentTreeViewProps) {
    <div className="w-64 bg-card border-l 
        <div className="flex items-center 
}

        </p>

  selectedId, 
            <div cla
  onDeleteComponent
              </p>
          
            </div>
            <div className="space-y-0.5">
                <TreeNode
                  component={component}
                  onSelect={onSelectComponent}
        </div>
              ))}
          Navigate nested structures
      </Scro
      </div>

  component: CanvasComponent;
  onSelect: (id: string) => v
  depth: number;

  component, 
  onSelect, 
  depth 
              </p>
  const isContainer = CONTAINER_TYPES.includes(component.type as an
  const getComponentIcon = (type: string) => {
    
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
            {isExp
      'aside': '📌',
              <
      'h1': 'H1',
        ) : (
      'h3': 'H3',

      'Label': '🏷️',
        </span>
      'Switch': '🔄',
          'text-sm font
      'Badge': '🔖',
          {component
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
    

        <d
    <div>
          
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

            className="flex-shrink-0 w-4 h-4 flex items-center justify-center hover:bg-secondary rounded transition-colors"

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

          {component.type}
        </span>

        {isContainer && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success font-medium flex-shrink-0">
            {component.children?.length || 0}
          </span>


        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 flex-shrink-0">
          <button

              e.stopPropagation();

            }}
            className="p-1 hover:bg-destructive/20 rounded transition-colors"
            title="Delete component"

            <Trash size={14} className="text-destructive" />

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

          ))}

      )}

  );

