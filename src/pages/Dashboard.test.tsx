import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext');
  return {
    ...actual as any,
    useAuth: () => ({ user: { uid: '123', email: 'test@test.com' }, loading: false })
  };
});

test('renders Dashboard page content', () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
