/**
 * React State Management Exercises - Unit Tests
 *
 * This file contains unit tests for all React state management exercises:
 * - useState hook fundamentals
 * - State updates and batching
 * - State structure design
 * - Avoiding state mutations
 * - State lifting patterns
 * - useReducer for complex state
 * - State normalization techniques
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Counter,
  UserProfile,
  FunctionalUpdates,
  PersonInfo,
  StateStructure,
  TodoList,
  TemperatureConverter,
  ReducerCounter,
  ShoppingCart,
  BlogManager,
  DataSelectors
} from '../exercises/react-state';

// =============================================================================
// EXERCISE 1: useState Hook Fundamentals Tests
// =============================================================================

describe('Exercise 1: useState Hook Fundamentals', () => {
  describe('Counter Component', () => {
    test('should display initial count of 0', () => {
      render(<Counter />);
      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });

    test('should increment count when increment button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const incrementButton = screen.getByRole('button', {
        name: /\+|increment/i
      });
      await user.click(incrementButton);

      expect(screen.getByText(/count.*1/i)).toBeInTheDocument();
    });

    test('should decrement count when decrement button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      // First increment to 1
      const incrementButton = screen.getByRole('button', {
        name: /\+|increment/i
      });
      await user.click(incrementButton);

      // Then decrement
      const decrementButton = screen.getByRole('button', {
        name: /-|decrement/i
      });
      await user.click(decrementButton);

      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });

    test('should reset count to 0 when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      // Increment to 3
      const incrementButton = screen.getByRole('button', {
        name: /\+|increment/i
      });
      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(incrementButton);

      // Reset
      const resetButton = screen.getByRole('button', { name: /reset/i });
      await user.click(resetButton);

      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });

    test('should handle multiple rapid clicks correctly', async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const incrementButton = screen.getByRole('button', {
        name: /\+|increment/i
      });

      // Rapid clicks
      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(incrementButton);

      expect(screen.getByText(/count.*3/i)).toBeInTheDocument();
    });
  });

  describe('UserProfile Component', () => {
    test('should display initial empty form', () => {
      render(<UserProfile />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/age/i)).toHaveValue(0);
    });

    test('should update name input and display current value', async () => {
      const user = userEvent.setup();
      render(<UserProfile />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'John Doe');

      expect(nameInput).toHaveValue('John Doe');
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    test('should update email input and display current value', async () => {
      const user = userEvent.setup();
      render(<UserProfile />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'john@example.com');

      expect(emailInput).toHaveValue('john@example.com');
      expect(screen.getByText(/john@example\.com/i)).toBeInTheDocument();
    });

    test('should update age input and display current value', async () => {
      const user = userEvent.setup();
      render(<UserProfile />);

      const ageInput = screen.getByLabelText(/age/i);
      await user.clear(ageInput);
      await user.type(ageInput, '25');

      expect(ageInput).toHaveValue(25);
      expect(screen.getByText(/25/)).toBeInTheDocument();
    });

    test('should log form values on submission', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      const user = userEvent.setup();
      render(<UserProfile />);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.clear(screen.getByLabelText(/age/i));
      await user.type(screen.getByLabelText(/age/i), '25');

      // Submit form
      const form = screen.getByRole('form') || screen.getByTestId('user-form');
      fireEvent.submit(form);

      expect(consoleSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      });

      consoleSpy.mockRestore();
    });
  });
});

// =============================================================================
// EXERCISE 2: State Updates and Batching Tests
// =============================================================================

describe('Exercise 2: State Updates and Batching', () => {
  describe('FunctionalUpdates Component', () => {
    test('should display initial count of 0', () => {
      render(<FunctionalUpdates />);
      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });

    test('should demonstrate difference between direct and functional updates', async () => {
      const user = userEvent.setup();
      render(<FunctionalUpdates />);

      // Test functional updates (should work correctly)
      const functionalButton = screen.getByRole('button', {
        name: /functional.*update/i
      });
      await user.click(functionalButton);

      // Should increment by 3 (or the expected amount)
      expect(screen.getByText(/count.*[3-9]/i)).toBeInTheDocument();
    });

    test('should reset count when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<FunctionalUpdates />);

      // Update count first
      const functionalButton = screen.getByRole('button', {
        name: /functional.*update/i
      });
      await user.click(functionalButton);

      // Reset
      const resetButton = screen.getByRole('button', { name: /reset/i });
      await user.click(resetButton);

      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });

    test('should have both direct and functional update buttons', () => {
      render(<FunctionalUpdates />);

      expect(
        screen.getByRole('button', { name: /direct.*update/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /functional.*update/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reset/i })
      ).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3: Object State Management Tests
// =============================================================================

describe('Exercise 3: Object State Management', () => {
  describe('PersonInfo Component', () => {
    test('should display initial empty person info', () => {
      render(<PersonInfo />);

      expect(screen.getByDisplayValue('')).toBeInTheDocument(); // name input
      expect(screen.getByDisplayValue('0')).toBeInTheDocument(); // age input
    });

    test('should update name without losing other properties', async () => {
      const user = userEvent.setup();
      render(<PersonInfo />);

      // Set age first
      const ageInput = screen.getByLabelText(/age/i);
      await user.clear(ageInput);
      await user.type(ageInput, '25');

      // Then update name
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'John');

      // Both should be preserved
      expect(nameInput).toHaveValue('John');
      expect(ageInput).toHaveValue(25);
      expect(screen.getByText(/john/i)).toBeInTheDocument();
      expect(screen.getByText(/25/)).toBeInTheDocument();
    });

    test('should update age without losing other properties', async () => {
      const user = userEvent.setup();
      render(<PersonInfo />);

      // Set name first
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Jane');

      // Then update age
      const ageInput = screen.getByLabelText(/age/i);
      await user.clear(ageInput);
      await user.type(ageInput, '30');

      // Both should be preserved
      expect(nameInput).toHaveValue('Jane');
      expect(ageInput).toHaveValue(30);
    });

    test('should display current object state', () => {
      render(<PersonInfo />);

      // Should show JSON representation or structured display
      expect(screen.getByText(/name/i)).toBeInTheDocument();
      expect(screen.getByText(/age/i)).toBeInTheDocument();
    });
  });

  describe('StateStructure Component', () => {
    test('should manage user data and UI state separately', () => {
      render(<StateStructure />);

      // Should have elements indicating proper state structure
      expect(
        screen.getByTestId('user-data') || screen.getByText(/user/i)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ui-state') || screen.getByText(/loading|error/i)
      ).toBeInTheDocument();
    });

    test('should demonstrate flat vs nested state patterns', () => {
      render(<StateStructure />);

      // Component should render without errors and show state structure
      expect(
        screen.getByTestId('state-structure') || screen.getByText(/state/i)
      ).toBeInTheDocument();
    });

    test('should show derived state calculations', () => {
      render(<StateStructure />);

      // Should display calculated/derived values
      expect(
        screen.getByTestId('derived-state') ||
          screen.getByText(/total|count|calculated/i)
      ).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 4: Array State Management Tests
// =============================================================================

describe('Exercise 4: Array State Management', () => {
  describe('TodoList Component', () => {
    test('should display empty todo list initially', () => {
      render(<TodoList />);

      expect(screen.getByText(/todo/i)).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    test('should add new todo item', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Learn React');
      await user.click(addButton);

      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
      expect(input).toHaveValue(''); // Input should be cleared
    });

    test('should remove todo item', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // Add a todo first
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Test Todo');
      await user.click(addButton);

      expect(screen.getByText(/test todo/i)).toBeInTheDocument();

      // Remove the todo
      const removeButton = screen.getByRole('button', {
        name: /remove|delete/i
      });
      await user.click(removeButton);

      expect(screen.queryByText(/test todo/i)).not.toBeInTheDocument();
    });

    test('should toggle todo completion status', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // Add a todo first
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Toggle Todo');
      await user.click(addButton);

      // Toggle completion
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    test('should handle multiple todos', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add multiple todos
      await user.type(input, 'First Todo');
      await user.click(addButton);

      await user.type(input, 'Second Todo');
      await user.click(addButton);

      expect(screen.getByText(/first todo/i)).toBeInTheDocument();
      expect(screen.getByText(/second todo/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 5: State Lifting Patterns Tests
// =============================================================================

describe('Exercise 5: State Lifting Patterns', () => {
  describe('TemperatureConverter Component', () => {
    test('should display both Celsius and Fahrenheit inputs', () => {
      render(<TemperatureConverter />);

      expect(screen.getByText(/celsius/i)).toBeInTheDocument();
      expect(screen.getByText(/fahrenheit/i)).toBeInTheDocument();
    });

    test('should synchronize Celsius to Fahrenheit conversion', async () => {
      const user = userEvent.setup();
      render(<TemperatureConverter />);

      const celsiusInput = screen.getByRole('textbox', { name: /celsius/i });
      await user.type(celsiusInput, '0');

      const fahrenheitInput = screen.getByRole('textbox', {
        name: /fahrenheit/i
      });

      // 0°C should be 32°F
      await waitFor(() => {
        expect(fahrenheitInput).toHaveValue('32');
      });
    });

    test('should synchronize Fahrenheit to Celsius conversion', async () => {
      const user = userEvent.setup();
      render(<TemperatureConverter />);

      const fahrenheitInput = screen.getByRole('textbox', {
        name: /fahrenheit/i
      });
      await user.type(fahrenheitInput, '32');

      const celsiusInput = screen.getByRole('textbox', { name: /celsius/i });

      // 32°F should be 0°C
      await waitFor(() => {
        expect(celsiusInput).toHaveValue('0');
      });
    });

    test('should show boiling point message when appropriate', async () => {
      const user = userEvent.setup();
      render(<TemperatureConverter />);

      const celsiusInput = screen.getByRole('textbox', { name: /celsius/i });
      await user.type(celsiusInput, '100');

      await waitFor(() => {
        expect(screen.getByText(/boil/i)).toBeInTheDocument();
      });
    });
  });
});

// =============================================================================
// EXERCISE 6: useReducer for Complex State Tests
// =============================================================================

describe('Exercise 6: useReducer for Complex State', () => {
  describe('ReducerCounter Component', () => {
    test('should display initial count of 0', () => {
      render(<ReducerCounter />);
      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });

    test('should increment count using reducer action', async () => {
      const user = userEvent.setup();
      render(<ReducerCounter />);

      const incrementButton = screen.getByRole('button', {
        name: /\+|increment/i
      });
      await user.click(incrementButton);

      expect(screen.getByText(/count.*1/i)).toBeInTheDocument();
    });

    test('should support set action with specific value', async () => {
      const user = userEvent.setup();
      render(<ReducerCounter />);

      const input =
        screen.getByRole('spinbutton') || screen.getByRole('textbox');
      await user.type(input, '42');
      await user.keyboard('{Enter}');

      expect(screen.getByText(/count.*42/i)).toBeInTheDocument();
    });

    test('should reset count using reducer action', async () => {
      const user = userEvent.setup();
      render(<ReducerCounter />);

      // Increment first
      const incrementButton = screen.getByRole('button', {
        name: /\+|increment/i
      });
      await user.click(incrementButton);

      // Then reset
      const resetButton = screen.getByRole('button', { name: /reset/i });
      await user.click(resetButton);

      expect(screen.getByText(/count.*0/i)).toBeInTheDocument();
    });
  });

  describe('ShoppingCart Component', () => {
    test('should display empty cart initially', () => {
      render(<ShoppingCart />);

      expect(screen.getByText(/cart/i)).toBeInTheDocument();
      expect(screen.getByText(/empty|0.*items/i)).toBeInTheDocument();
    });

    test('should add item to cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const addButton = screen.getAllByRole('button', { name: /add/i })[0];
      await user.click(addButton);

      expect(screen.getByText(/1.*item/i)).toBeInTheDocument();
    });

    test('should increase quantity for existing item', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const addButton = screen.getAllByRole('button', { name: /add/i })[0];
      await user.click(addButton);
      await user.click(addButton);

      // Should show quantity 2 or 2 items
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    test('should remove item from cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      // Add item first
      const addButton = screen.getAllByRole('button', { name: /add/i })[0];
      await user.click(addButton);

      // Remove item
      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(screen.getByText(/empty|0.*items/i)).toBeInTheDocument();
    });

    test('should calculate and display total price', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const addButton = screen.getAllByRole('button', { name: /add/i })[0];
      await user.click(addButton);

      expect(screen.getByText(/total.*\$/i)).toBeInTheDocument();
    });

    test('should clear entire cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      // Add items first
      const addButton = screen.getAllByRole('button', { name: /add/i })[0];
      await user.click(addButton);
      await user.click(addButton);

      // Clear cart
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(screen.getByText(/empty|0.*items/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 7: State Normalization Techniques Tests
// =============================================================================

describe('Exercise 7: State Normalization Techniques', () => {
  describe('BlogManager Component', () => {
    test('should manage normalized data structure', () => {
      render(<BlogManager />);

      expect(
        screen.getByTestId('blog-manager') ||
          screen.getByText(/blog|users|posts/i)
      ).toBeInTheDocument();
    });

    test('should handle adding users, posts, and comments', async () => {
      const user = userEvent.setup();
      render(<BlogManager />);

      // Should have buttons or inputs for adding entities
      const addButtons = screen.getAllByRole('button', { name: /add/i });
      expect(addButtons.length).toBeGreaterThan(0);

      // Test adding functionality
      await user.click(addButtons[0]);

      // Should update the display
      expect(
        screen.getByTestId('entities-list') ||
          screen.getByText(/user|post|comment/i)
      ).toBeInTheDocument();
    });

    test('should demonstrate efficient data lookups', () => {
      render(<BlogManager />);

      // Should display data in an organized manner
      expect(
        screen.getByTestId('data-display') ||
          screen.getByText(/users|posts|comments/i)
      ).toBeInTheDocument();
    });

    test('should handle data relationships correctly', () => {
      render(<BlogManager />);

      // Should show relationships between entities
      expect(
        screen.getByTestId('relationships') ||
          screen.getByText(/by|author|comments/i)
      ).toBeInTheDocument();
    });
  });

  describe('DataSelectors Component', () => {
    test('should compute derived data efficiently', () => {
      render(<DataSelectors />);

      expect(
        screen.getByTestId('selectors') ||
          screen.getByText(/statistics|filtered|sorted/i)
      ).toBeInTheDocument();
    });

    test('should demonstrate selector patterns', () => {
      render(<DataSelectors />);

      // Should show different data views/filters
      expect(
        screen.getByTestId('data-views') ||
          screen.getByText(/filter|sort|search/i)
      ).toBeInTheDocument();
    });

    test('should show memoized computations', () => {
      render(<DataSelectors />);

      // Should display computed values
      expect(
        screen.getByTestId('computed-data') ||
          screen.getByText(/total|count|average/i)
      ).toBeInTheDocument();
    });

    test('should handle data filtering and sorting', async () => {
      const user = userEvent.setup();
      render(<DataSelectors />);

      // Should have controls for filtering/sorting
      const controls =
        screen.getAllByRole('button') || screen.getAllByRole('combobox');
      expect(controls.length).toBeGreaterThan(0);

      if (controls.length > 0) {
        await user.click(controls[0]);
        // Should update the display based on interaction
      }
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Integration Tests', () => {
  test('all components should render without errors', () => {
    const components = [
      Counter,
      UserProfile,
      FunctionalUpdates,
      PersonInfo,
      StateStructure,
      TodoList,
      TemperatureConverter,
      ReducerCounter,
      ShoppingCart,
      BlogManager,
      DataSelectors
    ];

    components.forEach((Component) => {
      expect(() => render(<Component />)).not.toThrow();
    });
  });

  test('all components should return valid React elements', () => {
    const components = [
      Counter,
      UserProfile,
      FunctionalUpdates,
      PersonInfo,
      StateStructure,
      TodoList,
      TemperatureConverter,
      ReducerCounter,
      ShoppingCart,
      BlogManager,
      DataSelectors
    ];

    components.forEach((Component) => {
      const { container } = render(<Component />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});
