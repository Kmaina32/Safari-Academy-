
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button'; // Adjust the import path as necessary
import { Plus } from 'lucide-react';

describe('Button Component', () => {
  it('should render the button with its children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when the disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    expect(buttonElement).toBeDisabled();
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render as a different element when using asChild', () => {
    render(
      <Button asChild>
        <a href="/link">I am a link</a>
      </Button>
    );
    const linkElement = screen.getByRole('link', { name: /I am a link/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
  });

  it('should apply variant classes correctly', () => {
    render(<Button variant="destructive">Destructive</Button>);
    const buttonElement = screen.getByRole('button', { name: /Destructive/i });
    expect(buttonElement).toHaveClass('bg-destructive');
  });

  it('should apply size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /Large Button/i });
    expect(buttonElement).toHaveClass('h-11');
  });

  it('should render an icon when passed as a child', () => {
    render(
      <Button size="icon">
        <Plus data-testid="plus-icon" />
      </Button>
    );
    const iconElement = screen.getByTestId('plus-icon');
    expect(iconElement).toBeInTheDocument();
  });
});
