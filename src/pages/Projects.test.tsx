import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Projects from './Projects';
import { vi } from 'vitest';

vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../contexts/AuthContext');
  return {
    ...actual as any,
    useAuth: () => ({ user: { uid: '123', email: 'test@test.com' }, loading: false })
  };
});

test('renders Projects page content', () => {
  render(
    <BrowserRouter>
      <Projects />
    </BrowserRouter>
  );
  expect(screen.getByText(/Projects/i)).toBeInTheDocument();
});
