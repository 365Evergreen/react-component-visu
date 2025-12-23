# Planning Guide

A visual React component and page builder that bridges design and code, enabling designers to create production-ready app pages through an intuitive drag-and-drop interface with real-time TypeScript generation.

Use of WYSIWYG capabilities will drastically reduce development time, by giving developers ready-to-go code as a starter for the project.

**Experience Qualities**: 
1. **Professional** - The tool should feel like a robust IDE-meets-Figma experience that inspires confidence in the generated output
2. **Empowering** - Designers should feel capable and in control, with immediate visual feedback and clear guidance at every step
3. **Efficient** - Complex component creation should be streamlined, with smart defaults and quick access to common patterns

**Complexity Level**: Complex Application (advanced functionality, multiple views, nested state management)
This is a sophisticated visual IDE for React component creation with multiple interconnected panels, drag-and-drop interactions, real-time code generation, and Git integration capabilities.

## Essential Features

### Visual Component Canvas
- **Functionality**: Drag-and-drop canvas for building React component UIs with visual feedback
- **Purpose**: Bridge visual design to actual implementation code and create interactive prototypes
- **Trigger**: Designer drags components from library onto canvas or nests them inside containers
- **Progression**: Select component from library → Drag onto canvas or into container → Position and nest → Configure properties → View generated code
- **Success criteria**: Smooth drag operations, clear nesting indicators, accurate visual representation of component hierarchy

### Component Tree Navigation
- **Functionality**: Hierarchical tree view sidebar showing nested component structure with expand/collapse controls
- **Purpose**: Navigate complex nested component structures easily, especially when dealing with deeply nested containers
- **Trigger**: Automatically updates as components are added/nested, designer can click to select components
- **Progression**: View tree structure → Expand/collapse nested sections → Click component to select → See properties panel update
- **Success criteria**: Tree accurately reflects nesting, expand/collapse is smooth, selection synchronizes with canvas and property panel

### Component Nesting System
- **Functionality**: Drag components inside container components (Card, div, section, etc.) to create nested structures
- **Purpose**: Build complex component hierarchies visually
- **Trigger**: Designer drags a component onto a container component marked with "Container" badge
- **Progression**: Identify container → Drag component onto it → See drop zone highlight → Drop to nest → View in tree
- **Success criteria**: Clear visual indicators for drop zones, prevents circular nesting, displays nested children in tree view

### Property Editor
- **Functionality**: Dynamic property panel that updates based on selected component type
- **Purpose**: Configure component props, styles, and behaviors without writing code
- **Trigger**: Designer selects a component on canvas or in tree view
- **Progression**: Select component → View properties tab → Modify props/styles → See canvas update in real-time
- **Success criteria**: All relevant props editable, changes reflect immediately, type-appropriate inputs (text, select, color, etc.)

### Interaction & State Builder
- **Functionality**: Add event handlers (onClick, onChange, etc.) to components
- **Purpose**: Add interactivity without writing code manually
- **Trigger**: Designer selects component → Opens "Interactions" tab → Adds event
- **Progression**: Select element → Choose event type → Define state changes or actions → Preview interaction behavior
- **Success criteria**: Common events supported, actions properly generated in code output

### Code Generation Engine
- **Functionality**: Real-time generation of clean, production-ready TypeScript component code
- **Purpose**: Convert visual design into exportable React code
- **Trigger**: Automatically generates as designer builds, viewable in code panel
- **Progression**: Designer builds visually → Code generates in real-time → Designer reviews/copies code → Exports to library
- **Success criteria**: Generated code follows React best practices, properly typed, imports correct dependencies, human-readable

### Component Library Manager
- **Functionality**: Browse built-in component library (shadcn UI), view examples, search by name/description
- **Purpose**: Discover and understand available components before using them
- **Trigger**: Designer opens component library panel or searches for component
- **Progression**: Open library → Browse categories or search → View component preview/docs → Drag to canvas or click to add
- **Success criteria**: All shadcn components available, searchable, with visual previews and container badges

### Export & Storage System
- **Functionality**: Save generated components to local storage or push to Git repository
- **Purpose**: Persist work and integrate with existing development workflows
- **Trigger**: Designer clicks export/save button
- **Progression**: Complete component → Click export → Choose destination (local/git) → Configure options → Confirm save
- **Success criteria**: Components save reliably, Git integration works with authentication, local storage provides quick access

## Edge Case Handling

- **Empty Canvas State**: Display engaging onboarding with suggested starter templates and quick-start guide
- **Empty Tree State**: Show helpful message encouraging users to add components
- **Invalid Property Values**: Real-time validation with helpful error messages and suggested fixes
- **Nested Component Complexity**: Visual indicators for depth with indentation in tree, collapsible sections for complex hierarchies, drag-and-drop zone highlighting for containers
- **Container vs Non-Container**: Clear visual distinction between components that can contain children (Card, div, section) with "Container" badge and count of children
- **Circular Nesting Prevention**: Prevent dragging a parent component into its own children to avoid infinite loops
- **Deep Nesting Performance**: Optimize rendering for deeply nested structures with efficient tree rendering
- **Code Generation Errors**: Clear error messages pointing to problematic elements, graceful fallbacks
- **Lost Connection During Git Push**: Queue changes locally with retry mechanism and clear status indicators
- **Responsive Preview**: Canvas toggles between desktop/tablet/mobile viewports to test responsive behavior
- **Conflicting Style Properties**: Intelligent merging with warnings when styles override each other
- **Large Component Trees**: Virtual scrolling and performance optimizations for canvases with many elements

## Design Direction

The design should evoke the feeling of a professional creative tool—sophisticated yet approachable, technical yet visual. Think of the intersection between Figma's polish and VS Code's functionality. The interface should feel precise and purposeful, with a dark-leaning aesthetic that reduces eye strain during extended sessions while using vibrant accent colors to highlight interactive areas and provide clear visual hierarchy.
- **Functionality**: Save generated components to local storage or push to Git repository
- **Purpose**: Persist work and integrate with existing development workflows
- **Trigger**: Designer clicks export/save button
- **Progression**: Complete component → Click export → Choose destination (local/git) → Configure options → Confirm save
- **Success criteria**: Components save reliably, Git integration works with authentication, local storage provides quick access

## Edge Case Handling

- **Empty Canvas State**: Display engaging onboarding with suggested starter templates and quick-start guide
- **Invalid Property Values**: Real-time validation with helpful error messages and suggested fixes
- **Nested Component Complexity**: Visual indicators for depth with indentation, collapsible tree view for complex hierarchies, drag-and-drop zone highlighting for containers
- **Container vs Non-Container**: Clear visual distinction between components that can contain children (Card, div, section) and those that cannot (Input, Button)
- **Circular Nesting Prevention**: Prevent dragging a parent component into its own children to avoid infinite loops
- **Deep Nesting Performance**: Optimize rendering for deeply nested structures with efficient reconciliation
- **Code Generation Errors**: Clear error messages pointing to problematic elements, graceful fallbacks
- **Lost Connection During Git Push**: Queue changes locally with retry mechanism and clear status indicators
- **Responsive Preview**: Canvas toggles between desktop/tablet/mobile viewports to test responsive behavior
- **Conflicting Style Properties**: Intelligent merging with warnings when styles override each other
- **Large Component Trees**: Virtual scrolling and performance optimizations for canvases with many elements

## Design Direction

The design should evoke the feeling of a professional creative tool—sophisticated yet approachable, technical yet visual. Think of the intersection between Figma's polish and VS Code's functionality. The interface should feel precise and purposeful, with a dark-leaning aesthetic that reduces eye strain during extended sessions while using vibrant accent colors to highlight interactive areas and provide clear visual hierarchy.
## Color Selection

A developer-focused dark theme with electric accent colors that feel technical yet creative.

- **Primary Color**: Deep Slate Blue `oklch(0.25 0.04 260)` - Professional dark background that reduces eye strain and creates focus
- **Secondary Colors**: 
  - Canvas Gray `oklch(0.18 0.01 260)` - Even darker for the canvas area to make components pop
  - Panel Gray `oklch(0.22 0.02 260)` - Slightly lighter panels for property editors and sidebars
- **Accent Color**: Electric Cyan `oklch(0.75 0.15 195)` - Vibrant, energetic color for CTAs, selected states, and interactive elements
- **Supporting Colors**:
  - Success Green `oklch(0.65 0.18 145)` - For container badges and positive actions
  - Warning Amber `oklch(0.72 0.16 75)` - For warnings and important notifications
  - Destructive Red `oklch(0.55 0.22 25)` - For delete actions
- **Foreground/Background Pairings**: 
  - Primary Background (oklch(0.25 0.04 260)): Light Gray Text (oklch(0.92 0.01 260)) - Ratio 11.2:1 ✓
  - Canvas Gray (oklch(0.18 0.01 260)): Light Gray Text (oklch(0.92 0.01 260)) - Ratio 15.8:1 ✓
  - Accent Cyan (oklch(0.75 0.15 195)): Dark Text (oklch(0.15 0.02 260)) - Ratio 9.1:1 ✓
  - Success Green (oklch(0.65 0.18 145)): White Text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Warning Amber (oklch(0.72 0.16 75)): Dark Text (oklch(0.15 0.02 260)) - Ratio 8.8:1 ✓## Font Selection

The typography should communicate technical precision while remaining highly readable during long sessions—a clean, modern sans-serif for UI elements paired with a monospace font for code display.

- **Typographic Hierarchy**: 
  - H1 (Panel Titles): Space Grotesk Bold / 20px / -0.02em letter spacing / line-height 1.2
  - H2 (Section Headers): Space Grotesk SemiBold / 16px / -0.01em letter spacing / line-height 1.3
  - Body (UI Text): Inter Regular / 14px / normal letter spacing / line-height 1.5
  - Small (Labels): Inter Medium / 12px / 0.01em letter spacing / line-height 1.4
  - Code (Generated Code): JetBrains Mono Regular / 13px / normal letter spacing / line-height 1.6

## Animations

Animations should feel responsive and purposeful—quick transitions that confirm actions without delaying workflow. Canvas element additions should have a subtle scale-in effect (0.95 to 1.0 over 150ms). Panel transitions should slide smoothly (200ms ease-out). Selected elements get a gentle pulsing outline to draw attention. Drag operations show smooth ghost previews with slight opacity. Tree view expand/collapse uses smooth height transitions. Code generation should have a subtle syntax highlight animation as new lines appear. Overall, movements should feel snappy and precise like a professional tool.

## Component Selection

- **Components**: 
  - Left Sidebar: Component library with `ScrollArea`, `Input` for search, category groupings
  - Main Canvas: Custom component with pan/zoom capabilities, using `Card` for component wrappers on canvas
  - Right Tree Sidebar: `ScrollArea` with custom tree node components, expand/collapse icons from Phosphor
  - Right Property Panel: `Tabs` for switching between Properties/Interactions/Code views, `Form` components for property editing
  - Top Toolbar: `Button` variants for save/export/preview, `DropdownMenu` for export options
  - Code Viewer: `Textarea` or custom code display with syntax highlighting, `Button` for copy
  - Dialogs: `Dialog` for export configuration, `AlertDialog` for destructive actions
  - Toast: `sonner` for save confirmations and error notifications

- **Customizations**: 
  - Custom tree node component with indentation, expand/collapse, and hover states
  - Custom component wrapper with selection indicators and resize handles
  - Drag ghost preview with reduced opacity
  - Syntax-highlighted code display (possibly using a lightweight highlighter)

- **States**: 
  - Tree nodes: Subtle background on hover, accent background when selected, smooth expand/collapse animation
  - Canvas elements: Subtle border on hover, thick accent border when selected
  - Property inputs: Focus ring in accent color, validation states for errors
  - Drag states: Reduced opacity (0.5) for dragging element, drop zones highlight with accent border

- **Icon Selection**: 
  - Component Library: `Package` for library icon
  - Tree View: `Tree` for sidebar icon, `CaretRight`/`CaretDown` for expand/collapse
  - Add Element: `Plus` for adding new elements
  - Properties: `SlidersHorizontal` for property editing
  - Interactions: `Lightning` for event handlers
  - Code: `Code` or `FileCode` for code view
  - Delete: `Trash` for removing elements
  - Search: `MagnifyingGlass` for search inputs
  - Export: `Download` or `FloppyDisk` for save operations
  - Git: `GitBranch` for repository operations
  - Preview: `Eye` for preview mode

- **Spacing**: 
  - Main layout: No gaps, panels fill to edges with internal padding
  - Sidebars: p-4 internal padding, gap-3 for list items
  - Tree view: Compact spacing with 0.5 gaps between nodes, 12px indentation per level
  - Property editor: p-4 panel padding, gap-4 between sections, gap-2 for label/input pairs
  - Canvas: p-6 for breathing room around components
  
- **Mobile**: 
  This is a professional tool optimized for desktop/laptop use (minimum 1024px). On smaller screens, show a message encouraging use on larger displays. If tablet support is desired, collapse left sidebar to a drawer accessible via hamburger menu, keep canvas as primary view, tree view and property panel becomes a bottom sheet that slides up when element is selected.
