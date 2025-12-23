import { ComponentLibraryItem } from '@/types/component';

export const CONTAINER_TYPES = ['Card', 'div', 'section', 'header', 'footer', 'main', 'article', 'nav', 'aside'] as const;

export const COMPONENT_LIBRARY: ComponentLibraryItem[] = [
    {
      type: 'Carousel',
      category: 'Data Display',
      description: 'Scrollable carousel for items',
      icon: 'Carousel',
      defaultProps: {
        children: [
          {
            type: 'Card',
            props: {
              children: 'Carousel Item 1',
            },
            children: [],
            events: [],
          },
          {
            type: 'Card',
            props: {
              children: 'Carousel Item 2',
            },
            children: [],
            events: [],
          },
          {
            type: 'Card',
            props: {
              children: 'Carousel Item 3',
            },
            children: [],
            events: [],
          },
        ],
      },
    },
    {
      type: 'Menubar',
      category: 'Navigation',
      description: 'Horizontal menu bar',
      icon: 'Menu',
      defaultProps: {
        children: [
          {
            type: 'MenubarMenu',
            props: {
              children: [
                {
                  type: 'MenubarTrigger',
                  props: { children: 'File' },
                  children: [],
                  events: [],
                },
                {
                  type: 'MenubarContent',
                  props: {
                    children: [
                      {
                        type: 'MenubarItem',
                        props: { children: 'New' },
                        children: [],
                        events: [],
                      },
                      {
                        type: 'MenubarItem',
                        props: { children: 'Open' },
                        children: [],
                        events: [],
                      },
                    ],
                  },
                  children: [],
                  events: [],
                },
              ],
            },
            children: [],
            events: [],
          },
        ],
      },
    },
    {
      type: 'Card',
      category: 'Data Display',
      description: 'Container with elevation',
      icon: 'Rectangle',
      defaultProps: {
        children: [
          {
            type: 'CardHeader',
            props: {
              children: [
                {
                  type: 'CardTitle',
                  props: { children: 'Card Title' },
                  children: [],
                  events: [],
                },
                {
                  type: 'CardDescription',
                  props: { children: 'Card description goes here.' },
                  children: [],
                  events: [],
                },
              ],
            },
            children: [],
            events: [],
          },
          {
            type: 'CardContent',
            props: { children: 'Main card content.' },
            children: [],
            events: [],
          },
          {
            type: 'CardFooter',
            props: { children: 'Footer actions.' },
            children: [],
            events: [],
          },
        ],
      },
    },
  {
    type: 'Button',
    category: 'Form',
    description: 'Clickable button with variants',
    icon: 'RectangleHorizontal',
    defaultProps: { children: 'Button', variant: 'default' },
  },
  {
    type: 'Input',
    category: 'Form',
    description: 'Text input field',
    icon: 'Textbox',
    defaultProps: { placeholder: 'Enter text...', type: 'text' },
  },
  {
    type: 'Card',
    category: 'Data Display',
    description: 'Container with elevation',
    icon: 'Rectangle',
    defaultProps: { children: 'Card Content' },
  },
  {
    type: 'Label',
    category: 'Form',
    description: 'Text label for inputs',
    icon: 'TextT',
    defaultProps: { children: 'Label' },
  },
  {
    type: 'Checkbox',
    category: 'Form',
    description: 'Checkbox input',
    icon: 'CheckSquare',
    defaultProps: {},
  },
  {
    type: 'Switch',
    category: 'Form',
    description: 'Toggle switch',
    icon: 'Toggle',
    defaultProps: {},
  },
  {
    type: 'Select',
    category: 'Form',
    description: 'Dropdown select menu',
    icon: 'CaretDown',
    defaultProps: {},
  },
  {
    type: 'Textarea',
    category: 'Form',
    description: 'Multi-line text input',
    icon: 'TextAlignLeft',
    defaultProps: { placeholder: 'Enter text...' },
  },
  {
    type: 'Badge',
    category: 'Data Display',
    description: 'Small status badge',
    icon: 'Tag',
    defaultProps: { children: 'Badge' },
  },
  {
    type: 'Alert',
    category: 'Feedback',
    description: 'Alert message box',
    icon: 'Info',
    defaultProps: {},
  },
  {
    type: 'Separator',
    category: 'Layout',
    description: 'Visual divider',
    icon: 'Minus',
    defaultProps: {},
  },
  {
    type: 'Progress',
    category: 'Feedback',
    description: 'Progress indicator',
    icon: 'Circle',
    defaultProps: { value: 50 },
  },
  {
    type: 'Tabs',
    category: 'Navigation',
    description: 'Tabbed interface',
    icon: 'Tabs',
    defaultProps: {},
  },
  {
    type: 'Accordion',
    category: 'Data Display',
    description: 'Collapsible content',
    icon: 'CaretDown',
    defaultProps: {},
  },
  {
    type: 'Avatar',
    category: 'Data Display',
    description: 'User avatar image',
    icon: 'UserCircle',
    defaultProps: {},
  },
  {
    type: 'div',
    category: 'Layout',
    description: 'Generic container',
    icon: 'Square',
    defaultProps: { children: 'Div Container' },
  },
  {
    type: 'section',
    category: 'Layout',
    description: 'Section container',
    icon: 'SquareHalf',
    defaultProps: { children: 'Section' },
  },
  {
    type: 'header',
    category: 'Layout',
    description: 'Header container',
    icon: 'Layout',
    defaultProps: { children: 'Header' },
  },
  {
    type: 'p',
    category: 'HTML',
    description: 'Paragraph text',
    icon: 'TextT',
    defaultProps: { children: 'Paragraph text' },
  },
  {
    type: 'h1',
    category: 'HTML',
    description: 'Main heading',
    icon: 'TextHOne',
    defaultProps: { children: 'Heading 1' },
  },
  {
    type: 'h2',
    category: 'HTML',
    description: 'Subheading',
    icon: 'TextHTwo',
    defaultProps: { children: 'Heading 2' },
  },
  {
    type: 'h3',
    category: 'HTML',
    description: 'Section heading',
    icon: 'TextHThree',
    defaultProps: { children: 'Heading 3' },
  },
];