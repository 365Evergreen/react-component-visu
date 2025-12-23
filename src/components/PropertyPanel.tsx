import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlidersHorizontal, Lightning, Code, Copy } from '@phosphor-icons/react';
import { CanvasComponent, EventType } from '@/types/component';
import { generateComponentCode } from '@/lib/code-generator';
import { toast } from 'sonner';

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | null;
  onUpdateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
}

export function PropertyPanel({ selectedComponent, onUpdateComponent }: PropertyPanelProps) {
  const [generatedCode, setGeneratedCode] = useState('');

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-card border-l border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground p-6">
          <SlidersHorizontal size={48} className="mx-auto mb-3 opacity-50" />
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
    <div className="w-96 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary" />
          {selectedComponent.type}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">ID: {selectedComponent.id.slice(0, 8)}</p>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
          <TabsTrigger value="interactions" className="flex-1">Interactions</TabsTrigger>
          <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
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
                    <Lightning size={16} className="mr-2" />
                    Add onClick
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddEvent('onChange')}
                  >
                    <Lightning size={16} className="mr-2" />
                    Add onChange
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAddEvent('onSubmit')}
                  >
                    <Lightning size={16} className="mr-2" />
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
                  <Code size={16} className="mr-2" />
                  Generate
                </Button>
                {generatedCode && (
                  <Button
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    <Copy size={16} className="mr-2" />
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