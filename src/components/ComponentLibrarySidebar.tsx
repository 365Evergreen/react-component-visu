import React, { useState } from 'react';
// Simple SVG icons for top-level groups
const icons = {
  Tools: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M17.7 14.7l-2.4-2.4a1 1 0 0 0-1.4 0l-1.1 1.1-3.6-3.6 1.1-1.1a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.1 1.1a3 3 0 0 0 0 4.2l7.1 7.1a3 3 0 0 0 4.2 0l1.1-1.1a1 1 0 0 0 0-1.4z" fill="currentColor"/></svg>
  ),
  Layouts: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor"/></svg>
  ),
  Navigation: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2l2.39 7.26H20l-6.19 4.49L15.82 20 10 15.27 4.18 20l1.99-6.25L0 9.26h7.61z" fill="currentColor"/></svg>
  ),
  Components: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="10" r="3" fill="currentColor"/></svg>
  ),
import { Input } from '@/components/ui/input';
import { PageLayoutPicker } from './PageLayoutPicker';
import { ThemeDesigner } from './ThemeDesigner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search16Regular, Box20Regular } from '@fluentui/react-icons';
import { COMPONENT_LIBRARY } from '@/lib/component-library';
import { ComponentType } from '@/types/component';




import { cn } from '@/lib/utils';

// Friendly names for groups and components
const GROUP_LABELS: Record<string, string> = {
  tools: 'Tools',
  layouts: 'Layouts',
  navigation: 'Navigation',
  components: 'Components',
};

const FRIENDLY_NAMES: Record<string, string> = {
  'theme-generator': 'Theme Generator',
  'page-layouts': 'Page Layouts',
  menubar: 'Horizontal menu bar',
  tabs: 'Tabbed interface',
  button: 'Clickable button with variants',
  input: 'Text input field',
  label: 'Text label for inputs',
  checkbox: 'Checkbox input',
  switch: 'Toggle switch',
  select: 'Dropdown select menu',
  textarea: 'Multi-line text input',
  carousel: 'Scrollable carousel for items',
  card: 'Container with elevation',
  badge: 'Small status badge',
  // ...add more as needed
};

interface ComponentLibrarySidebarProps {
  selected: string | null;
  onSelect: (key: string) => void;
}

export const ComponentLibrarySidebar: React.FC<ComponentLibrarySidebarProps> = ({ selected, onSelect }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Tools: false,
    Layouts: false,
    Navigation: false,
    Components: false,
  });
  const [collapsed, setCollapsed] = useState<boolean>(true); // Sidebar collapsed by default

  const handleExpand = (group: string) => {
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Sidebar structure (only friendly names, no internal names)
  const sidebarGroups = [
    {
      key: 'tools',
      label: GROUP_LABELS['tools'],
      children: [
        { key: 'theme-generator', label: FRIENDLY_NAMES['theme-generator'] },
      ],
    },
    {
      key: 'layouts',
      label: GROUP_LABELS['layouts'],
      children: [
        { key: 'page-layouts', label: FRIENDLY_NAMES['page-layouts'] },
      ],
    },
    {
      key: 'navigation',
      label: GROUP_LABELS['navigation'],
      children: [
        { key: 'menubar', label: FRIENDLY_NAMES['menubar'] },
        { key: 'tabs', label: FRIENDLY_NAMES['tabs'] },
      ],
    },
    {
      key: 'components',
      label: GROUP_LABELS['components'],
      children: [
        {
          key: 'forms',
          label: 'Forms',
          children: [
            { key: 'input', label: FRIENDLY_NAMES['input'] },
            { key: 'label', label: FRIENDLY_NAMES['label'] },
            { key: 'checkbox', label: FRIENDLY_NAMES['checkbox'] },
            { key: 'switch', label: FRIENDLY_NAMES['switch'] },
            { key: 'select', label: FRIENDLY_NAMES['select'] },
            { key: 'textarea', label: FRIENDLY_NAMES['textarea'] },
          ],
        },
        {
          key: 'data',
          label: 'Data',
          children: [
            { key: 'badge', label: FRIENDLY_NAMES['badge'] },
            { key: 'carousel', label: FRIENDLY_NAMES['carousel'] },
          ],
        },
        {
          key: 'panel',
          label: 'Panel',
          children: [
            { key: 'card', label: FRIENDLY_NAMES['card'] },
            { key: 'button', label: FRIENDLY_NAMES['button'] },
          ],
        },
      ],
    },
  ];

  return (
    <nav
      className="w-64 h-full border-r flex flex-col py-4 px-2 text-base"
      style={{
        background: 'var(--sidebar)',
        borderColor: 'var(--sidebar-border)',
        color: 'var(--sidebar-foreground)',
      }}
    >
        <div className="flex items-center justify-between px-4 py-2">
          {!collapsed && <span className="font-bold text-lg">Builder</span>}
          <button
            className="ml-auto p-1 rounded hover:bg-accent/30"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(c => !c)}
          >
            {collapsed ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l6 5-6 5V5z" fill="currentColor"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M13 5l-6 5 6 5V5z" fill="currentColor"/></svg>
            )}
          </button>
        </div>
      <div className="flex-1 overflow-y-auto">
        {sidebarGroups.map((group) => (
          <div key={group.key} className="mb-2">
            <button
              className="flex items-center w-full px-2 py-1 font-semibold rounded transition text-base"
              style={{
                color: 'var(--sidebar-foreground)',
                background: 'transparent',
              }}
              onClick={() => handleExpand(group.key)}
              aria-expanded={expanded[group.key]}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-accent)')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="mr-2">
                {expanded[group.key] ? '▼' : '▶'}
              </span>
              {group.label}
            </button>
            {expanded[group.key] && group.children && (
              <ul className="ml-6 mt-1">
                {group.children.map((item) => (
                  item.children ? (
                    <li key={item.key}>
                      <button
                        className="flex items-center w-full px-2 py-1 font-semibold rounded transition text-base"
                        style={{
                          color: 'var(--sidebar-foreground)',
                          background: 'transparent',
                        }}
                        onClick={() => handleExpand(item.key)}
                        aria-expanded={expanded[item.key]}
                        onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-accent)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span className="mr-2">{expanded[item.key] ? '▼' : '▶'}</span>
                        {item.label}
                      </button>
                      {expanded[item.key] && (
                        <ul className="ml-6 mt-1">
                          {item.children.map((subitem: any) => (
                            <li key={subitem.key}>
                              <button
                                className={cn(
                                  'w-full text-left px-2 py-1 rounded transition text-base',
                                  selected === subitem.key ? 'font-semibold' : ''
                                )}
                                style={{
                                  color: selected === subitem.key ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                                  background: selected === subitem.key ? 'var(--sidebar-accent)' : 'transparent',
                                }}
                                onClick={() => onSelect(subitem.key)}
                                onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-accent)')}
                                onMouseOut={e => (e.currentTarget.style.background = selected === subitem.key ? 'var(--sidebar-accent)' : 'transparent')}
                              >
                                {subitem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.key}>
                      <button
                        className={cn(
                          'w-full text-left px-2 py-1 rounded transition text-base',
                          selected === item.key ? 'font-semibold' : ''
                        )}
                        style={{
                          color: selected === item.key ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                          background: selected === item.key ? 'var(--sidebar-accent)' : 'transparent',
                        }}
                        onClick={() => onSelect(item.key)}
                        onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-accent)')}
                        onMouseOut={e => (e.currentTarget.style.background = selected === item.key ? 'var(--sidebar-accent)' : 'transparent')}
                      >
                        {item.label}
                      </button>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};