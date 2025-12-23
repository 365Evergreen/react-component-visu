import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/ui/color-picker';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings24Regular, Flash24Regular, Code24Regular, Copy24Regular, TreeDeciduous20Regular, DeveloperBoardLightning20Regular, Code20Regular } from '@fluentui/react-icons';
import { CanvasComponent, EventType } from '@/types/component';
import { generateComponentCode } from '@/lib/code-generator';
import { CONTAINER_TYPES } from '@/lib/component-library';
import { toast } from 'sonner';

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | null;
  onUpdateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PropertyPanel({ selectedComponent, onUpdateComponent, collapsed = false, onToggleCollapse }: PropertyPanelProps) {
  if (collapsed) {
    return (
      <div className="transition-all duration-200 w-12 min-w-[3rem] bg-card border-l border-border flex flex-col items-center justify-center">
        <button
          className="p-1 rounded hover:bg-muted"
          aria-label="Expand sidebar"
          onClick={onToggleCollapse}
        >
          <span aria-hidden>«</span>
        </button>
      </div>
    );
  }
  const [generatedCode, setGeneratedCode] = useState('');

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-card border-l border-border flex items-center justify-center relative">
        <button
          className="absolute left-0 top-2 p-1 rounded hover:bg-muted"
          aria-label="Collapse sidebar"
          onClick={onToggleCollapse}
        >
          <span aria-hidden>»</span>
        </button>
        <div className="text-center text-muted-foreground p-6">
          <Settings24Regular className="mx-auto mb-3 opacity-50 w-12 h-12" />
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [key]: value }
    });
  };

  const handleStyleChange = (value: string) => {
    onUpdateComponent(selectedComponent.id, { styles: value });
  };

  const handleAddEvent = (eventType: EventType) => {
    const newEvent = {
      type: eventType,
      action: 'log' as const,
    };
    onUpdateComponent(selectedComponent.id, {
      events: [...selectedComponent.events, newEvent]
    });
    toast.success(`${eventType} event added`);
  };

  const handleGenerateCode = () => {
    const code = generateComponentCode(selectedComponent, 'GeneratedComponent');
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col h-full relative">
      <button
        className="absolute left-0 top-2 p-1 rounded hover:bg-muted"
        aria-label="Collapse sidebar"
        onClick={onToggleCollapse}
      >
        <span aria-hidden>»</span>
      </button>
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Settings24Regular className="text-primary w-5 h-5 inline-block" />
          {selectedComponent.type}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">ID: {selectedComponent.id.slice(0, 8)}</p>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-4">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="interactions">Events</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Content</Label>
                {selectedComponent.props.children !== undefined && (
                  <div>
                    <Label htmlFor="children" className="text-sm">Text Content</Label>
                    <Input
                      id="children"
                      value={selectedComponent.props.children || ''}
                      onChange={(e) => handlePropChange('children', e.target.value)}
                      placeholder="Enter text..."
                      className="mt-1"
                    />
                  </div>
                )}
                
                {selectedComponent.props.placeholder !== undefined && (
                  <div>
                    <Label htmlFor="placeholder" className="text-sm">Placeholder</Label>
                    <Input
                      id="placeholder"
                      value={selectedComponent.props.placeholder || ''}
                      onChange={(e) => handlePropChange('placeholder', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {selectedComponent.props.variant !== undefined && (
                  <div>
                    <Label htmlFor="variant" className="text-sm">Variant</Label>
                    <Select
                      value={selectedComponent.props.variant || 'default'}
                      onValueChange={(value) => handlePropChange('variant', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="destructive">Destructive</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedComponent.props.value !== undefined && (
                  <div>
                    <Label htmlFor="value" className="text-sm">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      value={selectedComponent.props.value || 0}
                      onChange={(e) => handlePropChange('value', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Styling</Label>
                <div className="flex flex-col gap-2">
                  <ColorPicker
                    label="Background"
                    value={selectedComponent.props.bgColor || '#22223b'}
                    onChange={val => handlePropChange('bgColor', val)}
                  />
                  <ColorPicker
                    label="Foreground"
                    value={selectedComponent.props.fgColor || '#e0e0e0'}
                    onChange={val => handlePropChange('fgColor', val)}
                  />
                  <div>
                    <Label htmlFor="styles" className="text-sm">Tailwind Classes</Label>
                    <Textarea
                      id="styles"
                      value={selectedComponent.styles || ''}
                      onChange={(e) => handleStyleChange(e.target.value)}
                      placeholder="e.g., bg-blue-500 text-white p-4"
                      className="mt-1 font-mono text-xs"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="children" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-3 block flex items-center gap-2">
                  <TreeDeciduous20Regular className="inline-block mr-1 w-4 h-4" />
                  Nested Components
                </Label>
                
                {CONTAINER_TYPES.includes(selectedComponent.type as any) ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        This is a container component. You can drag other components into it to create nested structures.
                      </p>
                    </div>
                    
                    {selectedComponent.children && selectedComponent.children.length > 0 ? (
                      <div>
                        <Label className="text-sm mb-2 block">
                          Children ({selectedComponent.children.length})
                        </Label>
                        <div className="space-y-2">
                          {selectedComponent.children.map((child, index) => (
                            <div 
                              key={child.id} 
                              className="p-3 rounded-md bg-secondary/50 border border-border"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium">{child.type}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    ID: {child.id.slice(0, 8)}...
                                  </div>
                                </div>
                                <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                                  #{index + 1}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground text-sm border border-dashed border-border rounded-md">
                        No nested components yet. Drag components here to nest them.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm border border-dashed border-border rounded-md">
                    <p className="mb-2">This component cannot contain children.</p>
                    <p className="text-xs">Try using containers like Card, div, section, or header.</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="interactions" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-3 block">
                  Event Handlers
                </Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddEvent('onClick')}
                  >
                    <Flash24Regular className="mr-2 w-4 h-4 inline-block" />
                    Add onClick
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddEvent('onChange')}
                  >
                    <Code24Regular className="mr-2 w-4 h-4 inline-block" />
                    Add onChange
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddEvent('onSubmit')}
                  >
                    <DeveloperBoardLightning20Regular className="mr-2 w-4 h-4 inline-block" />
                    Add onSubmit
                  </Button>
                </div>
              </div>

              {selectedComponent.events.length > 0 && (
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                    Active Events
                  </Label>
                  <div className="space-y-2">
                    {selectedComponent.events.map((event, index) => (
                      <div key={index} className="p-3 rounded-md bg-secondary/50 border border-border">
                        <div className="text-sm font-medium">{event.type}</div>
                        <div className="text-xs text-muted-foreground mt-1">Action: {event.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="code" className="flex-1 mt-0 flex flex-col">
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Generated Code
              </Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateCode}
                >
                  <Code20Regular className="mr-2 w-4 h-4 inline-block" />
                  Generate
                </Button>
                {generatedCode && (
                  <Button
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    <Copy24Regular className="mr-2 w-4 h-4 inline-block" />
                    Copy
                  </Button>
                )}
              </div>
            </div>
            
            <ScrollArea className="flex-1 rounded-md border border-border bg-canvas">
              <pre className="p-4 text-xs font-mono">
                <code>{generatedCode || 'Click "Generate" to see the code'}</code>
              </pre>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}