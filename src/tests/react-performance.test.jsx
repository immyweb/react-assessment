/**
 * React Performance Optimization Tests
 *
 * Simple unit tests for React performance optimization exercises
 */

import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

import {
  MemoizedChild,
  MemoizationDemo,
  ExpensiveMemoCalculator,
  OptimizedList,
  UserProfilePage,
  UserProfile,
  UserSettings,
  ActivityFeed,
  LazyLoadingDemo,
  VirtualList,
  RegularChild,
  generateMockData,
  PerformanceExercisesDemo
} from '../exercises/react-performance';

// =============================================================================
// SETUP
// =============================================================================

const mockConsole = vi.fn();
const originalConsoleLog = console.log;

beforeEach(() => {
  console.log = mockConsole;
  mockConsole.mockClear();
  vi.clearAllMocks();
});

afterEach(() => {
  console.log = originalConsoleLog;
  vi.restoreAllMocks();
});

// =============================================================================
// EXERCISE 1: Memoization Tests
// =============================================================================

describe('Memoization Components', () => {
  describe('MemoizedChild', () => {
    it('renders with props', () => {
      render(<MemoizedChild name="Alice" count={5} />);

      expect(screen.getByText('Memoized Child')).toBeInTheDocument();
      expect(screen.getByText('Name: Alice')).toBeInTheDocument();
      expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });

    it('logs renders to console', () => {
      render(<MemoizedChild name="Alice" count={5} />);

      expect(mockConsole).toHaveBeenCalledWith(
        'MemoizedChild rendered with: Alice, 5'
      );
    });
  });

  describe('MemoizationDemo', () => {
    it('renders demo interface', () => {
      render(<MemoizationDemo />);

      expect(screen.getByText('Memoization Demo')).toBeInTheDocument();
      expect(screen.getByText('Toggle Child Name')).toBeInTheDocument();
      expect(screen.getByText('Increment Count')).toBeInTheDocument();
      expect(screen.getByText(/Update Unrelated State/)).toBeInTheDocument();
    });

    it('toggles child name when button clicked', async () => {
      const user = userEvent.setup();
      render(<MemoizationDemo />);

      const toggleButton = screen.getByText('Toggle Child Name');
      await user.click(toggleButton);

      // Should show one of the names
      expect(screen.getByText(/Name: (Alice|Bob)/)).toBeInTheDocument();
    });
  });

  describe('ExpensiveMemoCalculator', () => {
    it('renders calculator interface', () => {
      render(<ExpensiveMemoCalculator />);

      expect(
        screen.getByText('Expensive Calculation with useMemo')
      ).toBeInTheDocument();
      expect(screen.getByText('Numbers: 1, 2, 3, 4, 5')).toBeInTheDocument();
      expect(screen.getByText(/Result:/)).toBeInTheDocument();
      expect(screen.getByText(/Calculation time:/)).toBeInTheDocument();
    });

    it('accepts custom numbers', () => {
      render(<ExpensiveMemoCalculator numbers={[10, 20]} />);

      expect(screen.getByText('Numbers: 10, 20')).toBeInTheDocument();
    });
  });

  describe('OptimizedList', () => {
    it('renders list interface', () => {
      render(<OptimizedList />);

      expect(
        screen.getByText('Optimized List with useCallback')
      ).toBeInTheDocument();
      expect(screen.getByText('Add Item')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('adds items when button clicked', async () => {
      const user = userEvent.setup();
      render(<OptimizedList />);

      const addButton = screen.getByText('Add Item');
      await user.click(addButton);

      expect(screen.getByText('Item 4')).toBeInTheDocument();
    });

    it('removes items when remove clicked', async () => {
      const user = userEvent.setup();
      render(<OptimizedList />);

      const removeButton = screen.getAllByText('Remove')[0];
      await user.click(removeButton);

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 2: Component Splitting Tests
// =============================================================================

describe('Component Splitting', () => {
  describe('UserProfilePage', () => {
    it('renders main profile page', () => {
      render(<UserProfilePage userId={123} />);

      expect(screen.getByText('User Profile Page')).toBeInTheDocument();
    });

    it('renders all sections', () => {
      render(<UserProfilePage userId={123} />);

      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });

  describe('UserProfile', () => {
    it('renders profile section', () => {
      render(<UserProfile userId={123} />);

      expect(screen.getByText('Profile Information')).toBeInTheDocument();
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });

    it('updates name when button clicked', async () => {
      const user = userEvent.setup();
      render(<UserProfile userId={123} />);

      const updateButton = screen.getByText('Update Name');
      await user.click(updateButton);

      expect(screen.getByText('Name: John Doe Jr.')).toBeInTheDocument();
    });
  });

  describe('UserSettings', () => {
    it('renders settings section', () => {
      render(<UserSettings userId={123} />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Enable Notifications')).toBeInTheDocument();
    });

    it('toggles notifications', async () => {
      const user = userEvent.setup();
      render(<UserSettings userId={123} />);

      const checkbox = screen.getByLabelText('Enable Notifications');
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('ActivityFeed', () => {
    it('renders activity section', () => {
      render(<ActivityFeed userId={123} />);

      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Logged in')).toBeInTheDocument();
    });

    it('respects limit prop', () => {
      render(<ActivityFeed userId={123} limit={2} />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(2);
    });
  });
});

// =============================================================================
// EXERCISE 3: Lazy Loading Tests
// =============================================================================

describe('Lazy Loading', () => {
  describe('LazyLoadingDemo', () => {
    it('renders tab interface', () => {
      render(<LazyLoadingDemo />);

      expect(screen.getByText('Lazy Loading Demo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('shows home content by default', () => {
      render(<LazyLoadingDemo />);

      expect(screen.getByText('Welcome Home!')).toBeInTheDocument();
    });

    it('switches tabs', async () => {
      const user = userEvent.setup();
      render(<LazyLoadingDemo />);

      const dashboardTab = screen.getByText('Dashboard');
      await user.click(dashboardTab);

      // Should show loading or loaded content
      await waitFor(() => {
        expect(
          screen.queryByText('Loading Dashboard...') ||
            screen.queryByText('Heavy Dashboard Component')
        ).toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// EXERCISE 4: Virtual List Tests
// =============================================================================

describe('Virtual List', () => {
  const mockData = generateMockData(100);

  describe('VirtualList', () => {
    it('renders virtual list interface', () => {
      render(<VirtualList items={mockData} />);

      expect(screen.getByText('Virtual List Demo')).toBeInTheDocument();
      expect(screen.getByText(/Showing \d+ of \d+ items/)).toBeInTheDocument();
    });

    it('handles empty items', () => {
      render(<VirtualList items={[]} />);

      expect(screen.getByText('Showing 0 of 0 items')).toBeInTheDocument();
    });

    it('shows scroll information', () => {
      render(<VirtualList items={mockData} />);

      expect(screen.getByText(/Scroll position:/)).toBeInTheDocument();
      expect(screen.getByText(/Visible range:/)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// Helper Components Tests
// =============================================================================

describe('Helper Components', () => {
  describe('RegularChild', () => {
    it('renders child component', () => {
      render(<RegularChild name="Alice" count={5} />);

      expect(
        screen.getByText('Regular Child (always re-renders)')
      ).toBeInTheDocument();
      expect(screen.getByText('Name: Alice')).toBeInTheDocument();
      expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });

    it('always logs renders', () => {
      render(<RegularChild name="Alice" count={5} />);

      expect(mockConsole).toHaveBeenCalledWith(
        'RegularChild rendered with: Alice, 5'
      );
    });
  });

  describe('generateMockData', () => {
    it('generates specified number of items', () => {
      const data = generateMockData(50);

      expect(data).toHaveLength(50);
      expect(data[0]).toHaveProperty('id', 0);
      expect(data[0]).toHaveProperty('name', 'Item 0');
    });

    it('generates items with correct structure', () => {
      const data = generateMockData(5);

      data.forEach((item, index) => {
        expect(item).toHaveProperty('id', index);
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('status');
      });
    });
  });

  describe('PerformanceExercisesDemo', () => {
    it('renders main demo component', () => {
      render(<PerformanceExercisesDemo />);

      expect(
        screen.getByText('React Performance Optimization Exercises')
      ).toBeInTheDocument();
    });

    it('includes all exercise components', () => {
      render(<PerformanceExercisesDemo />);

      expect(screen.getByText('Memoization Demo')).toBeInTheDocument();
      expect(
        screen.getByText('Expensive Calculation with useMemo')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Optimized List with useCallback')
      ).toBeInTheDocument();
      expect(screen.getByText('User Profile Page')).toBeInTheDocument();
      expect(screen.getByText('Lazy Loading Demo')).toBeInTheDocument();
      expect(screen.getByText('Virtual List Demo')).toBeInTheDocument();
    });
  });
});
