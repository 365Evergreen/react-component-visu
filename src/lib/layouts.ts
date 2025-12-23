import { CanvasComponent } from '@/types/component';

export const LAYOUTS: Record<string, CanvasComponent[]> = {
  landing: [
    {
      id: 'hero-1',
      type: 'section',
      props: { children: 'Hero Section' },
      children: [
        { id: 'h1-1', type: 'h1', props: { children: 'Welcome to Spark' }, children: [], events: [], styles: 'text-4xl font-bold' },
        { id: 'p-1', type: 'p', props: { children: 'A short tagline that describes the product.' }, children: [], events: [], styles: 'mt-2 text-muted-foreground' },
        { id: 'cta-1', type: 'Button', props: { children: 'Get Started' }, children: [], events: [], styles: 'mt-4' }
      ],
      events: [],
      styles: 'py-20 text-center'
    },
    {
      id: 'features-1',
      type: 'section',
      props: { children: 'Features' },
      children: [
        { id: 'f1', type: 'Card', props: { children: 'Fast' }, children: [], events: [], styles: '' },
        { id: 'f2', type: 'Card', props: { children: 'Composable' }, children: [], events: [], styles: '' },
        { id: 'f3', type: 'Card', props: { children: 'Themeable' }, children: [], events: [], styles: '' },
      ],
      events: [],
      styles: 'py-8 grid grid-cols-3 gap-4'
    }
  ],
  dashboard: [
    {
      id: 'sidebar-1',
      type: 'aside',
      props: { children: 'Nav' },
      children: [
        { id: 'nav-1', type: 'Button', props: { children: 'Overview' }, children: [], events: [], styles: 'w-full text-left' },
        { id: 'nav-2', type: 'Button', props: { children: 'Reports' }, children: [], events: [], styles: 'w-full text-left' },
      ],
      events: [],
      styles: 'w-64 p-4 bg-card'
    },
    {
      id: 'content-1',
      type: 'main',
      props: { children: 'Content' },
      children: [
        { id: 'h1-2', type: 'h1', props: { children: 'Dashboard' }, children: [], events: [], styles: 'text-2xl font-semibold' },
        { id: 'grid-1', type: 'div', props: { children: 'Grid' }, children: [
          { id: 'card-1', type: 'Card', props: { children: 'Metric 1' }, children: [], events: [], styles: '' },
          { id: 'card-2', type: 'Card', props: { children: 'Metric 2' }, children: [], events: [], styles: '' }
        ], events: [], styles: 'grid grid-cols-2 gap-4 mt-4' }
      ],
      events: [],
      styles: 'flex-1 p-6'
    }
  ],
  'two-column': [
    {
      id: 'left-1',
      type: 'div',
      props: { children: 'Left Navigation' },
      children: [
        { id: 'menu-1', type: 'Button', props: { children: 'Item A' }, children: [], events: [], styles: 'w-full text-left' },
        { id: 'menu-2', type: 'Button', props: { children: 'Item B' }, children: [], events: [], styles: 'w-full text-left' }
      ],
      events: [],
      styles: 'w-1/3 p-4'
    },
    {
      id: 'right-1',
      type: 'div',
      props: { children: 'Main content area' },
      children: [
        { id: 'h2-1', type: 'h2', props: { children: 'Page Title' }, children: [], events: [], styles: 'text-xl font-semibold' },
        { id: 'p-2', type: 'p', props: { children: 'Some introductory paragraph' }, children: [], events: [], styles: 'mt-2' }
      ],
      events: [],
      styles: 'flex-1 p-4'
    }
  ],
  form: [
    {
      id: 'form-1',
      type: 'section',
      props: { children: 'Form' },
      children: [
        { id: 'input-name', type: 'Input', props: { placeholder: 'Name' }, children: [], events: [], styles: '' },
        { id: 'input-email', type: 'Input', props: { placeholder: 'Email' }, children: [], events: [], styles: '' },
        { id: 'btn-submit', type: 'Button', props: { children: 'Submit' }, children: [], events: [], styles: '' }
      ],
      events: [],
      styles: 'max-w-lg mx-auto'
    }
  ]
};

export function getLayoutComponents(id: string): CanvasComponent[] {
  return LAYOUTS[id] ? JSON.parse(JSON.stringify(LAYOUTS[id])) : [];
}
