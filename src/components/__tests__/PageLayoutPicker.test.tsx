import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PageLayoutPicker } from '../PageLayoutPicker';

describe('PageLayoutPicker', () => {
  it('calls onLayoutSelect when Use is clicked', () => {
    const onLayoutSelect = vi.fn();
    render(<PageLayoutPicker onLayoutSelect={onLayoutSelect} />);

    const useButtons = screen.getAllByText('Use');
    expect(useButtons.length).toBeGreaterThan(0);

    fireEvent.click(useButtons[0]);
    expect(onLayoutSelect).toHaveBeenCalled();
  });
});
