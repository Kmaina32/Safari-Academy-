
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo Component', () => {
  it('should render the logo with the correct text', () => {
    render(<Logo />);
    
    // Check if the link points to the homepage
    const linkElement = screen.getByRole('link', { name: /Safari Academy Home/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');

    // Check if the application name is present
    const appNameElement = screen.getByText(/Safari Academy/i);
    expect(appNameElement).toBeInTheDocument();
  });
});
