// @ts-nocheck
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import * as AuthContextModule from '../contexts/AuthContext';

describe('AppLayout Component', () => {
  it('renders navigation links', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ user: { uid: '123' } as any, loading: false });
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
});
