import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Label } from './label';

export function ColorPicker({
  label,
  value,
  onChange,
  className,
  ...props
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
} & Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Label className="text-xs w-24">{label}</Label>
      <Input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
        style={{ minWidth: 32, minHeight: 32 }}
        {...props}
      />
      <span className="text-xs font-mono ml-2">{value}</span>
    </div>
  );
}
