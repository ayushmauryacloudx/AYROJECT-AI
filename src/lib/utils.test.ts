import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('bg-red-500', 'bg-blue-500', { 'text-white': true });
    expect(result).toContain('bg-blue-500 text-white');
  });
});
