import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header setSidebarOpen={() => {}} />);
    const brandElement = screen.getByText(/100 Write/i);
    expect(brandElement).toBeInTheDocument();
  });

  it('calls setSidebarOpen when the menu button is clicked', () => {
    const setSidebarOpen = jest.fn();
    render(<Header setSidebarOpen={setSidebarOpen} />);
    const menuButton = screen.getByLabelText(/Open sidebar/i);
    fireEvent.click(menuButton);
    expect(setSidebarOpen).toHaveBeenCalledWith(true);
  });
});
