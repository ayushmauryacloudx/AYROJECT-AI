import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';
import { vi } from 'vitest';

vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext');
  return {
    ...actual as any,
    useAuth: () => ({ user: { uid: '123', email: 'test@test.com' }, loading: false })
  };
});

test('renders Settings page content', () => {
  render(
    <BrowserRouter>
      <Settings />
    </BrowserRouter>
  );
  expect(screen.getByText(/Settings/i)).toBeInTheDocument();
});
