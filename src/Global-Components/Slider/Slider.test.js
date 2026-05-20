import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Sliderr from './Slider';

// Mock assets
jest.mock('../../Assets/Furniture Mecca/Landing Page/Slider/mobile-view-banner.png', () => 'imageOne');
jest.mock('../../Assets/Furniture Mecca/Landing Page/Slider/sofa4.png', () => 'imageTwo');
jest.mock('../../Assets/Furniture Mecca/Landing Page/Slider/sofa2.png', () => 'imageThree');
jest.mock('../../Assets/Loader-animations/loader-check-two.gif', () => 'loaderGif');

describe('Sliderr Component', () => {
  const mockImages = [
    { image_url: 'imageOne', link_url: 'product/1' },
    { image_url: 'imageTwo', link_url: 'product/2' },
    { image_url: 'imageThree', link_url: 'product/3' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders slider component without crashing', () => {
    render(<Sliderr images={mockImages} />);
    expect(screen.getByAltText('slide 1')).toBeInTheDocument();
  });

  test('displays the first slide initially', () => {
    render(<Sliderr images={mockImages} />);
    expect(screen.getByAltText('slide 1')).toBeInTheDocument();
  });

  test('automatically transitions slides every 3 seconds', () => {
    render(<Sliderr images={mockImages} />);
    expect(screen.getByAltText('slide 1')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
    expect(screen.getByAltText('slide 2')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
    expect(screen.getByAltText('slide 3')).toBeInTheDocument();
  });

  test('clicking right arrow navigates to the next slide', () => {
    render(<Sliderr images={mockImages} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next slide/i }));
    expect(screen.getByAltText('slide 2')).toBeInTheDocument();
  });

  test('clicking left arrow navigates to the previous slide', () => {
    render(<Sliderr images={mockImages} />);
    
    fireEvent.click(screen.getByRole('button', { name: /previous slide/i }));
    expect(screen.getByAltText('slide 3')).toBeInTheDocument(); // Last slide loops back
  });

  test('renders mobile view slides correctly', () => {
    render(<Sliderr images={mockImages} />);
    expect(screen.getAllByAltText(/slide/i)).toHaveLength(3);
  });

  test('renders the preloader before images load', () => {
    render(<Sliderr images={mockImages} />);
    expect(screen.getByAltText('loaderGif')).toBeInTheDocument();
  });

  test('removes the preloader after images load', () => {
    render(<Sliderr images={mockImages} />);
    
    fireEvent.load(screen.getByAltText('slide 1'));
    expect(screen.queryByAltText('loaderGif')).not.toBeInTheDocument();
  });

  test('loops correctly when navigating past the last slide', () => {
    render(<Sliderr images={mockImages} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next slide/i }));
    fireEvent.click(screen.getByRole('button', { name: /next slide/i }));
    fireEvent.click(screen.getByRole('button', { name: /next slide/i }));
    
    expect(screen.getByAltText('slide 1')).toBeInTheDocument(); // Back to first slide
  });
});
