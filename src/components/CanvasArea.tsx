import { CanvasComponent } from '@/types/component';
import { cn } from '@/lib/utils';

interface CanvasAreaProps {
  components: CanvasComponent[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
}

export function CanvasArea({ components, selectedId, onSelectComponent, onDeleteComponent }: CanvasAreaProps) {
  return (
    <div className="flex-1 bg-canvas overflow-auto">
      <div 
        className="min-h-full p-8"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.25 0.04 260) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      >
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Start Building</h3>
              <p className="text-muted-foreground max-w-md">
                Select a component from the library on the left to add it to your canvas.
                Build your React component visually.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-5xl mx-auto">
            {components.map((component) => (
              <CanvasComponentWrapper
                key={component.id}
                component={component}
                isSelected={selectedId === component.id}
                onSelect={onSelectComponent}
                onDelete={onDeleteComponent}
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
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function CanvasComponentWrapper({ component, isSelected, onSelect, onDelete }: CanvasComponentWrapperProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      className={cn(
        'relative rounded-lg p-4 transition-all cursor-pointer group',
        'bg-card/50 backdrop-blur-sm',
        isSelected 
          ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
          : 'hover:ring-1 hover:ring-border'
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            className="bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="absolute top-2 left-2 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
        {component.type}
      </div>
      
      <div className="mt-6">
        <ComponentPreview component={component} />
      </div>
    </div>
  );
}

function ComponentPreview({ component }: { component: CanvasComponent }) {
  const props = component.props;
  const styles = component.styles || '';
  
  switch (component.type) {
    case 'Button':
      return <button className={cn('px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium', styles)}>{props.children || 'Button'}</button>;
    
    case 'Input':
      return <input placeholder={props.placeholder} type={props.type || 'text'} className={cn('px-3 py-2 rounded-md border border-input bg-background', styles)} />;
    
    case 'Card':
      return <div className={cn('p-4 rounded-lg border border-border bg-card', styles)}>{props.children || 'Card Content'}</div>;
    
    case 'Label':
      return <label className={cn('text-sm font-medium', styles)}>{props.children || 'Label'}</label>;
    
    case 'Checkbox':
      return <input type="checkbox" className={cn('w-4 h-4', styles)} />;
    
    case 'Switch':
      return <button className={cn('w-11 h-6 rounded-full bg-muted relative', styles)}><span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-background"></span></button>;
    
    case 'Textarea':
      return <textarea placeholder={props.placeholder} className={cn('px-3 py-2 rounded-md border border-input bg-background min-h-20', styles)} />;
    
    case 'Badge':
      return <span className={cn('px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium', styles)}>{props.children || 'Badge'}</span>;
    
    case 'Separator':
      return <hr className={cn('border-t border-border', styles)} />;
    
    case 'Progress':
      return <div className={cn('h-2 w-full bg-muted rounded-full overflow-hidden', styles)}><div className="h-full bg-primary" style={{ width: `${props.value || 50}%` }}></div></div>;
    
    case 'div':
      return <div className={cn('p-4 border border-dashed border-border rounded', styles)}>{props.children || 'Div Container'}</div>;
    
    case 'section':
      return <section className={cn('p-4 border border-dashed border-border rounded', styles)}>{props.children || 'Section'}</section>;
    
    case 'header':
      return <header className={cn('p-4 border border-dashed border-border rounded', styles)}>{props.children || 'Header'}</header>;
    
    case 'p':
      return <p className={cn(styles)}>{props.children || 'Paragraph text'}</p>;
    
    case 'h1':
      return <h1 className={cn('text-3xl font-bold', styles)}>{props.children || 'Heading 1'}</h1>;
    
    case 'h2':
      return <h2 className={cn('text-2xl font-semibold', styles)}>{props.children || 'Heading 2'}</h2>;
    
    case 'h3':
      return <h3 className={cn('text-xl font-semibold', styles)}>{props.children || 'Heading 3'}</h3>;
    
    default:
      return <div className={cn('p-4 border border-dashed border-muted-foreground/20 rounded', styles)}>{component.type}</div>;
  }
}