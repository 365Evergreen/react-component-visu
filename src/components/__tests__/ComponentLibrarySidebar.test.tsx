import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComponentLibrarySidebar } from '../ComponentLibrarySidebar';

describe('ComponentLibrarySidebar', () => {
  it('renders tabs and switches to layouts and theme', () => {
    const onSelect = vi.fn();
    render(<ComponentLibrarySidebar onComponentSelect={(t) => onSelect(t as any)} /> as any);

    // Components tab is default
    expect(screen.getByText('Tools')).toBeTruthy();
    expect(screen.getByText('Components')).toBeTruthy();


    // Switch to Layouts
    fireEvent.click(screen.getByText('Layouts'));
    // Use regex matcher for robust text search
    expect(screen.getByText(/pick a page layout for full-page design/i)).toBeTruthy();

    // Switch to Theme
    fireEvent.click(screen.getByText('Theme'));
    expect(screen.getByText('Adjust the base theme tokens (applies live)')).toBeTruthy();
  });
});
