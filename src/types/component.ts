export type ComponentType = 
  | 'Button'
  | 'Input'
  | 'Card'
  | 'Dialog'
  | 'Select'
  | 'Checkbox'
  | 'Switch'
  | 'Textarea'
  | 'Label'
  | 'Badge'
  | 'Alert'
  | 'Tabs'
  | 'Accordion'
  | 'Avatar'
  | 'Progress'
  | 'Slider'
  | 'Table'
  | 'Separator'
  | 'ScrollArea'
  | 'Tooltip'
  | 'div'
  | 'section'
  | 'header'
  | 'footer'
  | 'main'
  | 'article'
  | 'nav'
  | 'aside'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'span'
  | 'img';

export type EventType = 'onClick' | 'onChange' | 'onSubmit' | 'onFocus' | 'onBlur' | 'onHover';

export interface ComponentEvent {
  type: EventType;
  action: 'setState' | 'log' | 'custom';
  target?: string;
  value?: string;
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children: CanvasComponent[];
  events: ComponentEvent[];
  styles?: string;
  position?: { x: number; y: number };
}

export interface ComponentLibraryItem {
  type: ComponentType;
  category: 'Layout' | 'Form' | 'Data Display' | 'Feedback' | 'Navigation' | 'HTML';
  description: string;
  defaultProps: Record<string, any>;
  icon: string;
  documentation?: string;
}

export interface ExportConfig {
  destination: 'local' | 'git';
  componentName: string;
  path?: string;
  repository?: string;
  branch?: string;
}

export interface ProjectState {
  components: CanvasComponent[];
  selectedComponentId: string | null;
  exportHistory: ExportConfig[];
}