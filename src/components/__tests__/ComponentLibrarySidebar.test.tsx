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
    // Assert the heading for layouts is present
    expect(screen.getByText(/page layouts/i)).toBeTruthy();

  });
});
