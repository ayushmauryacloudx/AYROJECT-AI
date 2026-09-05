import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';
import { AuthProvider } from '../contexts/AuthContext';

test('renders Signup page', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Signup />
      </AuthProvider>
    </BrowserRouter>
  );
  expect(screen.getByRole('heading', { name: /Create an account/i })).toBeInTheDocument();
});
