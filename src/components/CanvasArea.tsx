import { useState } from 'react';
import { CanvasComponent, ComponentType } from '@/types/component';
import { cn } from '@/lib/utils';
import { CONTAINER_TYPES, COMPONENT_LIBRARY } from '@/lib/component-library';

interface CanvasAreaProps {
  components: CanvasComponent[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onMoveComponent: (componentId: string, targetId: string | null, index?: number) => void;
  onAddComponentToContainer?: (type: ComponentType, targetId: string | null) => void;
}

export function CanvasArea({ 
  components, 
  selectedId, 
  onSelectComponent, 
  onDeleteComponent, 
  onMoveComponent,
  onAddComponentToContainer 
}: CanvasAreaProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string | null) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentType && onAddComponentToContainer) {
      onAddComponentToContainer(componentType as ComponentType, targetId);
    } else if (draggedId && draggedId !== targetId) {
      onMoveComponent(draggedId, targetId);
    }
    
    setDraggedId(null);
    setDropTargetId(null);
  };

  return (
    <div 
      className="flex-1 bg-[var(--canvas,var(--background))] overflow-auto"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => handleDrop(e, null)}
    >
      <div 
        className="min-h-full p-8"
      >
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center max-w-lg">
              <div className="text-6xl mb-4 opacity-20">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Start Building</h3>
              <p className="text-muted-foreground mb-6">
                Drag components from the library on the left or click to add them to your canvas.
                Build your React component visually.
              </p>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 text-left">
                <h4 className="font-semibold text-sm mb-2 text-primary">💡 Nesting Components</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Container components (Card, div, section) can hold other components</li>
                  <li>• Drag components onto containers to nest them inside</li>
                  <li>• Look for the green "Container" badge in the component library</li>
                  <li>• View nested children in the "Children" tab of the property panel</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-5xl mx-auto">
            {components.map((component) => (
              <CanvasComponentWrapper
                key={component.id}
                component={component}
                isSelected={selectedId === component.id}
                isDragging={draggedId === component.id}
                isDropTarget={dropTargetId === component.id}
                onSelect={onSelectComponent}
                onDelete={onDeleteComponent}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onDragEnter={(id) => setDropTargetId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CanvasComponentWrapperProps {
  component: CanvasComponent;
  isSelected: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, targetId: string | null) => void;
  onDragEnter: (id: string) => void;
  depth?: number;
}

import { useRef } from 'react';

function CanvasComponentWrapper({ 
  component, 
  isSelected, 
  isDragging,
  isDropTarget,
  onSelect, 
  onDelete,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragEnter,
  depth = 0
}: CanvasComponentWrapperProps) {
  const isContainer = CONTAINER_TYPES.includes(component.type as any);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inline editing for text content
  const canEditText = isSelected && typeof component.props.children === 'string';

  const handleTextClick = (e: React.MouseEvent) => {
    if (canEditText) {
      e.stopPropagation();
      setEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    component.props.children = e.target.value;
  };

  const handleTextBlur = () => {
    setEditing(false);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(component.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (isContainer) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onDragEnter={(e) => {
        if (isContainer) {
          e.stopPropagation();
          onDragEnter(component.id);
        }
      }}
      onDrop={(e) => {
        if (isContainer) {
          e.preventDefault();
          e.stopPropagation();
          onDrop(e, component.id);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      className={cn(
        'relative rounded-lg p-4 transition-all cursor-move group',
        'bg-[color-mix(in_oklch,var(--card)_50%,transparent)] backdrop-blur-sm',
        isDragging && 'opacity-50',
        isDropTarget && isContainer && 'ring-2 ring-[var(--success)] shadow-lg shadow-[color-mix(in_oklch,var(--success)_20%,transparent)]',
        isSelected 
          ? 'ring-2 ring-[var(--primary)] shadow-lg shadow-[color-mix(in_oklch,var(--primary)_20%,transparent)]' 
          : 'hover:ring-1 hover:ring-[var(--border)]',
        depth > 0 && 'ml-4'
      )}
      data-depth={depth}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            className="bg-[var(--destructive)] text-[var(--destructive-foreground)] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>
      )}
      <div className="absolute top-2 left-2 text-xs font-medium text-[var(--primary)] bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] px-2 py-1 rounded z-10">
        {component.type}
        {isContainer && ` (${component.children?.length || 0})`}
      </div>
      <div className="mt-6">
        {canEditText && editing ? (
          <input
            ref={inputRef}
            type="text"
            className="border rounded px-2 py-1 text-base w-full"
            value={component.props.children}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            onClick={e => e.stopPropagation()}
            placeholder="Edit text..."
            title="Edit component text"
          />
        ) : (
          <span
            className={canEditText ? 'cursor-text underline decoration-dotted' : ''}
            onClick={handleTextClick}
          >
            <ComponentPreview component={component} />
          </span>
        )}
      </div>
      {isContainer && component.children && component.children.length > 0 && (
        <div className="mt-3 space-y-2 border-l-2 border-[color-mix(in_oklch,var(--primary)_20%,transparent)] pl-3">
          {component.children.map((child) => (
            <CanvasComponentWrapper
              key={child.id}
              component={child}
              isSelected={isSelected}
              isDragging={isDragging}
              isDropTarget={isDropTarget}
              onSelect={onSelect}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onDragEnter={onDragEnter}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      {isContainer && isDropTarget && (
        <div className="mt-2 p-4 border-2 border-dashed border-[var(--success)] rounded-md bg-[color-mix(in_oklch,var(--success)_5%,transparent)]">
          <p className="text-xs text-center text-[var(--success)] font-medium">Drop here to nest</p>
        </div>
      )}
    </div>
  );
}

function ComponentPreview({ component }: { component: CanvasComponent }) {
  const props = component.props;
  const styles = component.styles || '';
  const hasChildren = component.children && component.children.length > 0;
  
  switch (component.type) {
    case 'Button':
      return <button className={cn('px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium', styles)}>{props.children || 'Button'}</button>;
    
    case 'Input':
      return <input placeholder={props.placeholder} type={props.type || 'text'} className={cn('px-3 py-2 rounded-md border border-input bg-background', styles)} />;
    
    case 'Card':
      return (
        <div className={cn('p-4 rounded-lg border border-border bg-card', styles)}>
          {hasChildren ? <span className="text-xs text-muted-foreground">Contains {component.children.length} component(s)</span> : props.children || 'Card Content'}
        </div>
      );
    
    case 'Label':
      return <label className={cn('text-sm font-medium', styles)}>{props.children || 'Label'}</label>;
    
    case 'Checkbox':
      return <input type="checkbox" className={cn('w-4 h-4', styles)} aria-label={props['aria-label'] || 'Checkbox'} />;
    
    case 'Switch':
      return <button className={cn('w-11 h-6 rounded-full bg-muted relative', styles)} title={props['aria-label'] || 'Switch'}><span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-background"></span></button>;
    
    case 'Textarea':
      return <textarea placeholder={props.placeholder} className={cn('px-3 py-2 rounded-md border border-input bg-background min-h-20', styles)} />;
    
    case 'Badge':
      return <span className={cn('px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium', styles)}>{props.children || 'Badge'}</span>;
    
    case 'Separator':
      return <hr className={cn('border-t border-border', styles)} />;
    
    case 'Progress':
      return (
        <div className={cn('h-2 w-full bg-muted rounded-full overflow-hidden', styles)}>
          <div
            className="h-full bg-primary progress-bar-inner"
            data-progress={props.value || 50}
          ></div>
        </div>
      );
    
    case 'div':
      return (
        <div className={cn('p-4 border border-dashed border-border rounded min-h-[60px]', styles)}>
          {hasChildren ? <span className="text-xs text-muted-foreground">Container with {component.children.length} component(s)</span> : props.children || 'Div Container'}
        </div>
      );
    
    case 'section':
      return (
        <section className={cn('p-4 border border-dashed border-border rounded min-h-[60px]', styles)}>
          {hasChildren ? <span className="text-xs text-muted-foreground">Section with {component.children.length} component(s)</span> : props.children || 'Section'}
        </section>
      );
    
    case 'header':
      return (
        <header className={cn('p-4 border border-dashed border-border rounded min-h-[60px]', styles)}>
          {hasChildren ? <span className="text-xs text-muted-foreground">Header with {component.children.length} component(s)</span> : props.children || 'Header'}
        </header>
      );
    
    case 'p':
      return <p className={cn(styles)}>{props.children || 'Paragraph text'}</p>;
    
    case 'h1':
      return <h1 className={cn('text-3xl font-bold', styles)}>{props.children || 'Heading 1'}</h1>;
    
    case 'h2':
      return <h2 className={cn('text-2xl font-semibold', styles)}>{props.children || 'Heading 2'}</h2>;
    
    case 'h3':
      return <h3 className={cn('text-xl font-semibold', styles)}>{props.children || 'Heading 3'}</h3>;
    
    default:
      return (
        <div className={cn('p-4 border border-dashed border-muted-foreground/20 rounded min-h-[60px]', styles)}>
          {hasChildren ? <span className="text-xs text-muted-foreground">{component.type} with {component.children.length} component(s)</span> : component.type}
        </div>
      );
  }
}