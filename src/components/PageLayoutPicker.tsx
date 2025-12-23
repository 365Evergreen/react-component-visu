import React from 'react';
import { Button } from '@/components/ui/button';
import { getLayoutComponents } from '@/lib/layouts';

export interface PageLayout {
  id: string;
  name: string;
  description?: string;
}

interface PageLayoutPickerProps {
  layouts?: PageLayout[];
  onLayoutSelect?: (layoutId: string) => void;
}

const DEFAULT_LAYOUTS: PageLayout[] = [
  { id: 'landing', name: 'Landing Page', description: 'Hero + Features + CTA' },
  { id: 'dashboard', name: 'Dashboard', description: 'Sidebar + Content grid' },
  { id: 'two-column', name: 'Two Column', description: 'Left nav + content' },
  { id: 'form', name: 'Form Page', description: 'Form-focused layout' },
];

export function PageLayoutPicker({ layouts = DEFAULT_LAYOUTS, onLayoutSelect }: PageLayoutPickerProps) {
  function handlePreview(id: string) {
    const comps = getLayoutComponents(id);
    const ev = new CustomEvent('spark:preview-layout', { detail: comps });
    window.dispatchEvent(ev);
  }

  function handleUse(id: string) {
    const comps = getLayoutComponents(id);
    const ev = new CustomEvent('spark:apply-layout', { detail: comps });
    window.dispatchEvent(ev);
    if (onLayoutSelect) onLayoutSelect(id);
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3">Page Layouts</h3>
      <div className="space-y-3">
        {layouts.map(l => (
          <div key={l.id} className="flex items-center gap-3 p-3 rounded border border-border">
            <div className="w-20 h-12 bg-muted/20 rounded flex items-center justify-center text-xs">
              {l.name}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{l.name}</div>
              <div className="text-xs text-muted-foreground">{l.description}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handlePreview(l.id)}>Preview</Button>
              <Button size="sm" onClick={() => handleUse(l.id)}>Use</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
