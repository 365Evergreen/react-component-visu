import { CanvasComponent } from '@/types/component';

export function generateComponentCode(component: CanvasComponent, componentName: string): string {
  const imports = generateImports(component);
  const stateDeclarations = generateStateDeclarations(component);
  const componentJSX = generateJSX(component, 1);
  
  return `import React, { useState } from 'react';
${imports}

export function ${componentName}() {
${stateDeclarations}
  return (
${componentJSX}
  );
}

export default ${componentName};`;
}

function generateImports(component: CanvasComponent): string {
  const imports = new Set<string>();
  
  function collectImports(comp: CanvasComponent) {
    if (isUIComponent(comp.type)) {
      imports.add(comp.type);
    }
    comp.children.forEach(collectImports);
  }
  
  collectImports(component);
  
  const uiImports = Array.from(imports);
  if (uiImports.length === 0) return '';
  
  return uiImports
    .map(comp => `import { ${comp} } from '@/components/ui/${comp.toLowerCase()}';`)
    .join('\n');
}

function isUIComponent(type: string): boolean {
  const uiComponents = [
    'Button', 'Input', 'Card', 'Dialog', 'Select', 'Checkbox', 
    'Switch', 'Textarea', 'Label', 'Badge', 'Alert', 'Tabs', 
    'Accordion', 'Avatar', 'Progress', 'Slider', 'Separator', 'Tooltip'
  ];
  return uiComponents.includes(type);
}

function generateStateDeclarations(component: CanvasComponent): string {
  const states = new Set<string>();
  
  function collectStates(comp: CanvasComponent) {
    comp.events.forEach(event => {
      if (event.action === 'setState' && event.target) {
        states.add(event.target);
      }
    });
    comp.children.forEach(collectStates);
  }
  
  collectStates(component);
  
  if (states.size === 0) return '';
  
  return Array.from(states)
    .map(state => `  const [${state}, set${capitalize(state)}] = useState('');`)
    .join('\n') + '\n';
}

function generateJSX(component: CanvasComponent, indent: number): string {
  const indentStr = '  '.repeat(indent);
  const tag = component.type;
  const props = generateProps(component);
  const events = generateEvents(component);
  const allProps = [...props, ...events].join(' ');
  
  if (component.children.length === 0 && !component.props.children) {
    return `${indentStr}<${tag}${allProps ? ' ' + allProps : ''} />`;
  }
  
  const childrenJSX = component.children.map(child => 
    generateJSX(child, indent + 1)
  ).join('\n');
  
  const textContent = component.props.children && typeof component.props.children === 'string'
    ? component.props.children
    : '';
  
  return `${indentStr}<${tag}${allProps ? ' ' + allProps : ''}>
${childrenJSX || (textContent ? indentStr + '  ' + textContent : '')}
${indentStr}</${tag}>`;
}

function generateProps(component: CanvasComponent): string[] {
  const props: string[] = [];
  
  Object.entries(component.props).forEach(([key, value]) => {
    if (key === 'children' && typeof value === 'string') return;
    
    if (typeof value === 'string') {
      props.push(`${key}="${value}"`);
    } else if (typeof value === 'boolean') {
      if (value) {
        props.push(key);
      }
    } else if (typeof value === 'number') {
      props.push(`${key}={${value}}`);
    } else {
      props.push(`${key}={${JSON.stringify(value)}}`);
    }
  });
  
  if (component.styles) {
    props.push(`className="${component.styles}"`);
  }
  
  return props;
}

function generateEvents(component: CanvasComponent): string[] {
  return component.events.map(event => {
    if (event.action === 'setState' && event.target) {
      return `${event.type}={(e) => set${capitalize(event.target)}(e.target.value)}`;
    } else if (event.action === 'log') {
      return `${event.type}={() => console.log('${event.type}')}`;
    }
    return `${event.type}={() => {}}`;
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}