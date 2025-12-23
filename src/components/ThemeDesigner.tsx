import React, { useState, useEffect } from 'react';
import { TreeView, TreeItem } from './TreeView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeGenerator } from './ThemeGenerator';


interface ThemeTokens {
  '--color-bg'?: string;
  '--color-fg'?: string;
  '--color-accent'?: string;
  '--color-success'?: string;
}

interface ThemeDesignerProps {
  initial?: ThemeTokens;
  onChange?: (tokens: ThemeTokens) => void;
}

export function ThemeDesigner(props: ThemeDesignerProps) {
  const { initial = {}, onChange } = props;
  const [tokens, setTokens] = useState<ThemeTokens>(initial);
  const [showGenerator, setShowGenerator] = useState(false);
  const [activeNode, setActiveNode] = useState<string>('theme-tokens');

  useEffect(() => {
    // Apply initial tokens on mount
    applyTokens(tokens);
  }, []);

  useEffect(() => {
    applyTokens(tokens);
    if (onChange) onChange(tokens);
  }, [tokens]);

  function applyTokens(t: ThemeTokens) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    Object.entries(t).forEach(([k, v]) => {
      if (v) root.style.setProperty(k, v);
    });
  }

  function handleChange(key: keyof ThemeTokens, value: string) {
    setTokens(prev => ({ ...prev, [key]: value }));
  }

  function downloadTheme() {
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleThemeGenSave(theme: any) {
    setTokens({
      '--color-bg': theme.background,
      '--color-fg': theme.text,
      '--color-accent': theme.primary,
      '--color-success': '#22c55e',
    });
    setShowGenerator(false);
  }

  return (
    <div className="flex h-full">
      <aside className="w-56 border-r bg-muted/40">
        <TreeView active={activeNode} onSelect={setActiveNode}>
          <TreeItem id="theme" label="Theme">
            <TreeItem id="theme-tokens" label="Tokens" />
            <TreeItem id="theme-generator" label="Theme Generator" />
          </TreeItem>
          <TreeItem id="layout" label="Layouts" />
          <TreeItem id="components" label="Components" />
        </TreeView>
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        {activeNode === 'theme-tokens' && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Theme Tokens</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs">Background</label>
                <Input value={tokens['--color-bg'] || ''} onChange={(e) => handleChange('--color-bg', e.target.value)} placeholder="#0f172a" />
              </div>
              <div>
                <label className="text-xs">Foreground</label>
                <Input value={tokens['--color-fg'] || ''} onChange={(e) => handleChange('--color-fg', e.target.value)} placeholder="#e6eef8" />
              </div>
              <div>
                <label className="text-xs">Accent</label>
                <Input value={tokens['--color-accent'] || ''} onChange={(e) => handleChange('--color-accent', e.target.value)} placeholder="#00d1ff" />
              </div>
              <div>
                <label className="text-xs">Success</label>
                <Input value={tokens['--color-success'] || ''} onChange={(e) => handleChange('--color-success', e.target.value)} placeholder="#22c55e" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => downloadTheme()}>Download theme</Button>
                <Button size="sm" variant="ghost" onClick={() => setTokens(initial)}>Reset</Button>
              </div>
            </div>
          </div>
        )}
        {activeNode === 'theme-generator' && (
          <div className="mt-2">
            <ThemeGenerator onSave={handleThemeGenSave} />
          </div>
        )}
        {activeNode === 'layout' && (
          <div className="text-muted-foreground">Layout options coming soon.</div>
        )}
        {activeNode === 'components' && (
          <div className="text-muted-foreground">Component options coming soon.</div>
        )}
      </main>
    </div>
  );
}
