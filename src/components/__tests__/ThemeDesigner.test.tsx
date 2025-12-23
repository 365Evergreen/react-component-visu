import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeDesigner } from '../ThemeDesigner';

describe('ThemeDesigner', () => {
  it('applies tokens to document root when changed', () => {
    render(<ThemeDesigner />);

    const bgInput = screen.getByPlaceholderText('#0f172a');
    fireEvent.change(bgInput, { target: { value: '#112233' } });

    expect(document.documentElement.style.getPropertyValue('--color-bg')).toBe('#112233');
  });
});
