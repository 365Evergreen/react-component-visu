import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import './theme-generator.css';
import { toast } from 'sonner';

function hexToRgb(hex: string) {
  const match = hex.replace('#', '').match(/.{1,2}/g);
  if (!match) return [0, 0, 0];
  return match.map(x => parseInt(x, 16));
}

function luminance([r, g, b]: number[]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(rgb1: number[], rgb2: number[]) {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

function getAccessibleTextColor(bg: string) {
  // Return black or white depending on contrast
  const white = [255, 255, 255];
  const black = [0, 0, 0];
  const bgRgb = hexToRgb(bg);
  return contrast(bgRgb, white) >= 4.5 ? '#ffffff' : '#222222';
}

export function ThemeGenerator({
  onSave
}: {
  onSave: (theme: any) => void;
}) {
  const [primary, setPrimary] = useState('#0078d4');
  const [background, setBackground] = useState('#ffffff');
  const [text, setText] = useState('#222222');
  const [error, setError] = useState('');

  // Derived variants
  const primary10 = primary + '1A'; // 10% opacity
  const primary20 = primary + '33'; // 20% opacity
  const background10 = background + '1A';
  const background20 = background + '33';

  // Accessibility check
  const contrastPrimaryBg = contrast(hexToRgb(primary), hexToRgb(background));
  const contrastTextBg = contrast(hexToRgb(text), hexToRgb(background));
  const contrastTextPrimary = contrast(hexToRgb(text), hexToRgb(primary));
  const accessible =
    contrastPrimaryBg >= 4.5 && contrastTextBg >= 4.5 && contrastTextPrimary >= 4.5;

  function handlePrimaryChange(val: string) {
    setPrimary(val);
    // If text or background are default, update them for best contrast
    if (text === '#222222' || text === '#ffffff') {
      setText(getAccessibleTextColor(val));
    }
    if (background === '#ffffff' || background === '#222222') {
      setBackground(getAccessibleTextColor(val) === '#ffffff' ? '#222222' : '#ffffff');
    }
  }

  function handleSave() {
    if (!accessible) {
      setError('Accessibility check failed: ensure all color pairs have contrast ratio ≥ 4.5');
      toast.error('Accessibility check failed');
      return;
    }
    setError('');
    onSave({
      primary,
      primary10,
      primary20,
      background,
      background10,
      background20,
      text,
    });
    toast.success('Theme saved!');
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg mb-2">Theme Generator</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Label className="w-32">Primary color</Label>
          <Input type="color" value={primary} onChange={e => handlePrimaryChange(e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" />
          <span className="font-mono text-xs">{primary}</span>
        </div>
        <div className="flex items-center gap-3">
          <Label className="w-32">Text color</Label>
          <Input type="color" value={text} onChange={e => setText(e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" />
          <span className="font-mono text-xs">{text}</span>
        </div>
        <div className="flex items-center gap-3">
          <Label className="w-32">Background color</Label>
          <Input type="color" value={background} onChange={e => setBackground(e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" />
          <span className="font-mono text-xs">{background}</span>
        </div>
      </div>
      <div className="flex gap-6 mt-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Primary 10%</Label>
          <div className="w-10 h-6 rounded theme-color-preview" data-color={primary10} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Primary 20%</Label>
          <div className="w-10 h-6 rounded theme-color-preview" data-color={primary20} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Background 10%</Label>
          <div className="w-10 h-6 rounded theme-color-preview" data-color={background10} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Background 20%</Label>
          <div className="w-10 h-6 rounded theme-color-preview" data-color={background20} />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex gap-4 items-center">
          <span className="text-xs">Contrast (Primary/Background): <span className={contrastPrimaryBg >= 4.5 ? 'text-green-500' : 'text-red-500'}>{contrastPrimaryBg.toFixed(2)}</span></span>
          <span className="text-xs">Contrast (Text/Background): <span className={contrastTextBg >= 4.5 ? 'text-green-500' : 'text-red-500'}>{contrastTextBg.toFixed(2)}</span></span>
          <span className="text-xs">Contrast (Text/Primary): <span className={contrastTextPrimary >= 4.5 ? 'text-green-500' : 'text-red-500'}>{contrastTextPrimary.toFixed(2)}</span></span>
        </div>
        {!accessible && <div className="text-red-500 text-xs mt-2">Accessibility check failed: all pairs must have contrast ≥ 4.5</div>}
        {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
      </div>
      <Button onClick={handleSave} disabled={!accessible} className="mt-2">Save Theme</Button>
    </div>
  );
}
