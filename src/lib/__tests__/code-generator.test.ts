import { describe, it, expect } from 'vitest';
import { generateComponentCode } from '../code-generator';

const sample = {
  id: 'root-1',
  type: 'div',
  props: {},
  children: [
    { id: 'btn-1', type: 'Button', props: { children: 'Click' }, children: [], events: [{ type: 'onClick', action: 'log' }], styles: '' },
    { id: 'input-1', type: 'Input', props: { placeholder: 'name' }, children: [], events: [{ type: 'onChange', action: 'setState', target: 'name' }], styles: '' }
  ],
  events: [],
  styles: ''
};

describe('generateComponentCode', () => {
  it('includes UI imports and state when events require it', () => {
    const code = generateComponentCode(sample as any, 'GeneratedTest');
    expect(code).toContain("import { Button } from '@/components/ui/button';");
    expect(code).toContain("import { Input } from '@/components/ui/input';");
    expect(code).toContain("const [name, setName] = useState('');");
    expect(code).toContain('<Button');
    expect(code).toContain('<Input');
    expect(code).toContain("export function GeneratedTest()");
  });
});
