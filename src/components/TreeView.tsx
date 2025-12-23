import React from 'react';

interface TreeViewProps {
  active: string;
  onSelect: (id: string) => void;
  children: React.ReactNode;
} // Added closing brace for TreeViewProps

interface TreeItemProps {
  id: string;
  label: string;
  children?: React.ReactNode;
} // Added closing brace for TreeItemProps

export function TreeView({ active, onSelect, children }: TreeViewProps) {
  React.useEffect(() => {
    function handler(e: any) {
      onSelect(e.detail);
    }
    window.addEventListener('treeview-select', handler);
    return () => window.removeEventListener('treeview-select', handler);
  }, [onSelect]);
  return (
    <ul className="py-2 px-1 text-sm select-none" role="tree">
      {children}
    </ul>
  );
}

export function TreeItem({ id, label, children }: TreeItemProps) {
  const [open, setOpen] = React.useState(false);
  const isGroup = !!children;
  const treeItemContent = (
    <div
      className={`flex items-center gap-1 cursor-pointer rounded px-2 py-1 hover:bg-accent ${isGroup ? 'font-semibold' : ''}`}
      onClick={() => (isGroup ? setOpen((v) => !v) : (window as any).treeViewSelect?.(id))}
      tabIndex={0}
    >
      {isGroup && (
        <span className="inline-block w-3 text-xs">{open ? '▼' : '▶'}</span>
      )}
      <span>{label}</span>
    </div>
  );

  if (isGroup) {
    return (
      <ul role="group">
        <li role="treeitem" aria-expanded={!!open}>
          {treeItemContent}
          {open && (
            <ul className="ml-4 border-l border-muted-foreground/20 pl-2" role="group">
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? React.cloneElement(child)
                  : child
              )}
            </ul>
          )}
        </li>
      </ul>
    );
  }
  return (
    <ul role="group">
      <li role="treeitem">
        {treeItemContent}
      </li>
    </ul>
  );
}


// TreeView selection handler (global, for demo; in real app, use context or props)
if (typeof window !== 'undefined') {
  (window as any).treeViewSelect = (id: string) => {
    const event = new CustomEvent('treeview-select', { detail: id });
    window.dispatchEvent(event);
  };
}
