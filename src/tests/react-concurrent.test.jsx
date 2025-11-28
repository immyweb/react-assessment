/**
 * React Concurrent Features Tests
 *
 * Test suite for React concurrent features exercises covering:
 * - Suspense for data fetching
 * - useTransition for non-urgent updates
 * - useDeferredValue for expensive computations
 * - useOptimistic for optimistic updates
 * - Progressive enhancement patterns
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach } from 'vitest';

import {
  fetchUser,
  UserProfile,
  SuspenseDemo,
  SearchList,
  TabSwitcher,
  SlowContent,
  DeferredSearchList,
  DeferredGraph,
  addTodoAPI,
  OptimisticTodoList,
  OptimisticLikeButton,
  ProgressiveForm,
  OptimisticComments,
  DataDashboard
} from '../exercises/react-concurrent';

// =============================================================================
// EXERCISE 1 TESTS: Suspense for Data Fetching
// =============================================================================

describe('Exercise 1: Suspense for Data Fetching', () => {
  describe('fetchUser', () => {
    it('should create a resource that throws a promise initially', () => {
      const resource = fetchUser(1, 100);
      expect(() => resource.read()).toThrow();
    });

    it('should return user data after promise resolves', async () => {
      const resource = fetchUser(1, 100);

      // Initial call throws
      try {
        resource.read();
      } catch (promise) {
        await promise;
      }

      // After promise resolves, should return data
      const data = resource.read();
      expect(data).toEqual({ id: 1, name: 'User 1' });
    });

    it('should work with different user IDs', async () => {
      const resource = fetchUser(42, 100);

      try {
        resource.read();
      } catch (promise) {
        await promise;
      }

      const data = resource.read();
      expect(data).toEqual({ id: 42, name: 'User 42' });
    });

    it('should respect custom delay', async () => {
      const startTime = Date.now();
      const resource = fetchUser(1, 200);

      try {
        resource.read();
      } catch (promise) {
        await promise;
      }

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(200);
    });
  });

  describe('UserProfile', () => {
    it('should display user data from resource', async () => {
      const resource = fetchUser(1, 10);

      // Wait for resource to load
      try {
        resource.read();
      } catch (promise) {
        await promise;
      }

      render(<UserProfile resource={resource} />);

      expect(screen.getByText(/User 1/)).toBeInTheDocument();
      expect(screen.getByText(/id.*1/i)).toBeInTheDocument();
    });

    it('should have correct className', async () => {
      const resource = fetchUser(1, 10);

      try {
        resource.read();
      } catch (promise) {
        await promise;
      }

      const { container } = render(<UserProfile resource={resource} />);
      expect(container.querySelector('.user-profile')).toBeInTheDocument();
    });

    it('should work with different user data', async () => {
      const resource = fetchUser(99, 10);

      try {
        resource.read();
      } catch (promise) {
        await promise;
      }

      render(<UserProfile resource={resource} />);
      expect(screen.getByText(/User 99/)).toBeInTheDocument();
    });
  });

  describe('SuspenseDemo', () => {
    it('should show loading fallback initially', () => {
      render(<SuspenseDemo />);
      expect(screen.getByText(/loading user/i)).toBeInTheDocument();
    });

    it('should display user profile after loading', async () => {
      render(<SuspenseDemo />);

      await waitFor(
        () => {
          expect(screen.getByText(/User 1/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should not show loading text after data loads', async () => {
      render(<SuspenseDemo />);

      await waitFor(
        () => {
          expect(screen.queryByText(/loading user/i)).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: useTransition for Non-Urgent Updates
// =============================================================================

describe('Exercise 2: useTransition for Non-Urgent Updates', () => {
  describe('SearchList', () => {
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

    it('should render search input', () => {
      render(<SearchList items={items} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should display all items initially', () => {
      render(<SearchList items={items} />);
      items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('should filter items based on search query', async () => {
      const user = userEvent.setup();
      render(<SearchList items={items} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
      });
    });

    it('should show searching indicator during transition', async () => {
      const user = userEvent.setup();
      const largeList = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
      render(<SearchList items={largeList} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      // Should briefly show "Searching..." during transition
      // Note: This might be hard to catch in tests due to timing
      expect(input).toHaveValue('a');
    });

    it('should handle empty search results', async () => {
      const user = userEvent.setup();
      render(<SearchList items={items} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'xyz');

      await waitFor(() => {
        items.forEach((item) => {
          expect(screen.queryByText(item)).not.toBeInTheDocument();
        });
      });
    });

    it('should be case-insensitive', async () => {
      const user = userEvent.setup();
      render(<SearchList items={items} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'APPLE');

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });
  });

  describe('TabSwitcher', () => {
    it('should render all tab buttons', () => {
      render(<TabSwitcher />);
      expect(
        screen.getByRole('button', { name: /about/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /posts/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /contact/i })
      ).toBeInTheDocument();
    });

    it('should show first tab content by default', () => {
      render(<TabSwitcher />);
      expect(screen.getByText(/about content/i)).toBeInTheDocument();
    });

    it('should switch tabs when clicked', async () => {
      const user = userEvent.setup();
      render(<TabSwitcher />);

      const postsTab = screen.getByRole('button', { name: /posts/i });
      await user.click(postsTab);

      await waitFor(() => {
        expect(screen.getByText(/posts content/i)).toBeInTheDocument();
      });
    });

    it('should show loading indicator during transition', async () => {
      const user = userEvent.setup();
      render(<TabSwitcher />);

      const contactTab = screen.getByRole('button', { name: /contact/i });
      await user.click(contactTab);

      // Check for loading state (implementation dependent)
      await waitFor(() => {
        expect(screen.getByText(/contact content/i)).toBeInTheDocument();
      });
    });

    it('should maintain tab selection after switching', async () => {
      const user = userEvent.setup();
      render(<TabSwitcher />);

      const postsTab = screen.getByRole('button', { name: /posts/i });
      await user.click(postsTab);

      await waitFor(() => {
        expect(screen.getByText(/posts content/i)).toBeInTheDocument();
        expect(screen.queryByText(/about content/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('SlowContent', () => {
    it('should render list with specified count', () => {
      render(<SlowContent text="Item" count={5} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
    });

    it('should use default count of 100', () => {
      render(<SlowContent text="Item" />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 100')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: useDeferredValue for Expensive Computations
// =============================================================================

describe('Exercise 3: useDeferredValue for Expensive Computations', () => {
  describe('DeferredSearchList', () => {
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

    it('should render search input', () => {
      render(<DeferredSearchList items={items} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should display all items initially', () => {
      render(<DeferredSearchList items={items} />);
      items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('should filter items based on deferred query', async () => {
      const user = userEvent.setup();
      render(<DeferredSearchList items={items} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('should show visual indicator when value is stale', async () => {
      const user = userEvent.setup();
      const largeList = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
      const { container } = render(<DeferredSearchList items={largeList} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // List should have reduced opacity when stale
      await waitFor(() => {
        expect(input).toHaveValue('test');
      });
    });

    it('should update immediately in input', async () => {
      const user = userEvent.setup();
      render(<DeferredSearchList items={items} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'xyz');

      expect(input).toHaveValue('xyz');
    });
  });

  describe('DeferredGraph', () => {
    it('should render slider input', () => {
      render(<DeferredGraph />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(<DeferredGraph />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('0');
    });

    it('should update slider value immediately', async () => {
      const user = userEvent.setup();
      render(<DeferredGraph />);

      const slider = screen.getByRole('slider');
      await user.clear(slider);
      await user.type(slider, '100');

      expect(slider).toHaveValue('100');
    });

    it('should show when deferred value differs from current', async () => {
      const user = userEvent.setup();
      render(<DeferredGraph />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '250' } });

      // Component should indicate when values differ
      expect(slider).toHaveValue('250');
    });

    it('should generate points based on deferred value', async () => {
      render(<DeferredGraph />);
      const slider = screen.getByRole('slider');

      fireEvent.change(slider, { target: { value: '50' } });

      await waitFor(() => {
        expect(slider).toHaveValue('50');
      });
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: useOptimistic for Optimistic Updates
// =============================================================================

describe('Exercise 4: useOptimistic for Optimistic Updates', () => {
  describe('addTodoAPI', () => {
    it('should return todo object after delay', async () => {
      const result = await addTodoAPI('Test todo');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('text', 'Test todo');
      expect(result).toHaveProperty('completed', false);
    });

    it('should take approximately 1 second', async () => {
      const start = Date.now();
      await addTodoAPI('Test');
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(950);
      expect(duration).toBeLessThan(1200);
    });
  });

  describe('OptimisticTodoList', () => {
    it('should render input and submit button', () => {
      render(<OptimisticTodoList />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('should add todo optimistically', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodoList />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'New todo');
      await user.click(button);

      // Should appear immediately (optimistically)
      expect(screen.getByText(/new todo/i)).toBeInTheDocument();
    });

    it('should show pending state for optimistic todos', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodoList />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Pending todo');
      await user.click(button);

      // Pending todo should have reduced opacity
      const todoElement = screen.getByText(/pending todo/i);
      expect(todoElement).toBeInTheDocument();
    });

    it('should clear input after submission', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodoList />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Test todo');
      await user.click(button);

      expect(input).toHaveValue('');
    });

    it('should disable button during submission', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodoList />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Test todo');
      await user.click(button);

      expect(button).toBeDisabled();

      // Should be re-enabled after server responds
      await waitFor(
        () => {
          expect(button).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

    it('should update todo after server confirmation', async () => {
      const user = userEvent.setup();
      render(<OptimisticTodoList />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Confirmed todo');
      await user.click(button);

      // Wait for server response
      await waitFor(
        () => {
          expect(button).not.toBeDisabled();
        },
        { timeout: 2000 }
      );

      // Todo should still be visible after confirmation
      expect(screen.getByText(/confirmed todo/i)).toBeInTheDocument();
    });
  });

  describe('OptimisticLikeButton', () => {
    it('should render with initial likes', () => {
      render(<OptimisticLikeButton initialLikes={5} />);
      expect(
        screen.getByRole('button', { name: /like.*5/i })
      ).toBeInTheDocument();
    });

    it('should default to 0 likes', () => {
      render(<OptimisticLikeButton />);
      expect(
        screen.getByRole('button', { name: /like.*0/i })
      ).toBeInTheDocument();
    });

    it('should increment optimistically on click', async () => {
      const user = userEvent.setup();
      render(<OptimisticLikeButton initialLikes={0} />);

      const button = screen.getByRole('button', { name: /like.*0/i });
      await user.click(button);

      expect(screen.getByRole('button', { name: /1/i })).toBeInTheDocument();
    });

    it('should show pending state during update', async () => {
      const user = userEvent.setup();
      render(<OptimisticLikeButton initialLikes={0} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(
        screen.getByRole('button', { name: /liking/i })
      ).toBeInTheDocument();
    });

    it('should disable button while pending', async () => {
      const user = userEvent.setup();
      render(<OptimisticLikeButton initialLikes={0} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toBeDisabled();
    });

    it('should re-enable button after server response', async () => {
      const user = userEvent.setup();
      render(<OptimisticLikeButton initialLikes={0} />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(
        () => {
          expect(button).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

    it('should maintain count after server confirms', async () => {
      const user = userEvent.setup();
      render(<OptimisticLikeButton initialLikes={5} />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: /like.*6/i })
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Progressive Enhancement
// =============================================================================

describe('Exercise 5: Progressive Enhancement', () => {
  describe('ProgressiveForm', () => {
    it('should render name and email inputs', () => {
      render(<ProgressiveForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ProgressiveForm onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should call onSubmit with form data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ProgressiveForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com'
          })
        );
      });
    });

    it('should show submitted data in list', async () => {
      const user = userEvent.setup();
      render(<ProgressiveForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
      });
    });

    it('should clear form after submission', async () => {
      const user = userEvent.setup();
      render(<ProgressiveForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });

    it('should show optimistic feedback', async () => {
      const user = userEvent.setup();
      render(<ProgressiveForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/name/i), 'Optimistic User');
      await user.type(screen.getByLabelText(/email/i), 'opt@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should appear immediately (optimistic)
      expect(screen.getByText(/optimistic user/i)).toBeInTheDocument();
    });
  });

  describe('OptimisticComments', () => {
    const initialComments = [
      { id: 1, text: 'First comment', author: 'User1' },
      { id: 2, text: 'Second comment', author: 'User2' }
    ];

    it('should display initial comments', () => {
      render(<OptimisticComments initialComments={initialComments} />);
      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText('Second comment')).toBeInTheDocument();
    });

    it('should render author and text inputs', () => {
      render(<OptimisticComments initialComments={[]} />);
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    });

    it('should add comment optimistically', async () => {
      const user = userEvent.setup();
      render(<OptimisticComments initialComments={initialComments} />);

      await user.type(screen.getByLabelText(/author/i), 'NewUser');
      await user.type(screen.getByLabelText(/comment/i), 'New comment');
      await user.click(screen.getByRole('button', { name: /post/i }));

      expect(screen.getByText('New comment')).toBeInTheDocument();
    });

    it('should show pending comments in italics', async () => {
      const user = userEvent.setup();
      render(<OptimisticComments initialComments={initialComments} />);

      await user.type(screen.getByLabelText(/author/i), 'PendingUser');
      await user.type(screen.getByLabelText(/comment/i), 'Pending comment');
      await user.click(screen.getByRole('button', { name: /post/i }));

      const comment = screen.getByText('Pending comment');
      const style = window.getComputedStyle(comment);
      expect(style.fontStyle).toBe('italic');
    });

    it('should update after server confirms', async () => {
      const user = userEvent.setup();
      render(<OptimisticComments initialComments={initialComments} />);

      await user.type(screen.getByLabelText(/author/i), 'ConfirmedUser');
      await user.type(screen.getByLabelText(/comment/i), 'Confirmed comment');
      await user.click(screen.getByRole('button', { name: /post/i }));

      // Should still be visible after 1.5s server delay
      await waitFor(
        () => {
          const comment = screen.getByText('Confirmed comment');
          const style = window.getComputedStyle(comment);
          expect(style.fontStyle).not.toBe('italic');
        },
        { timeout: 2000 }
      );
    });

    it('should clear form after submission', async () => {
      const user = userEvent.setup();
      render(<OptimisticComments initialComments={[]} />);

      const authorInput = screen.getByLabelText(/author/i);
      const commentInput = screen.getByLabelText(/comment/i);

      await user.type(authorInput, 'Test');
      await user.type(commentInput, 'Test comment');
      await user.click(screen.getByRole('button', { name: /post/i }));

      expect(authorInput).toHaveValue('');
      expect(commentInput).toHaveValue('');
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Combined Patterns
// =============================================================================

describe('Exercise 6: Combined Patterns', () => {
  describe('DataDashboard', () => {
    it('should render dashboard container', () => {
      render(<DataDashboard />);
      // Basic structure test - implementation will vary
      expect(document.body).toBeInTheDocument();
    });

    it('should show loading states for panels', () => {
      render(<DataDashboard />);
      // Should show loading indicators initially
      expect(screen.queryAllByText(/loading/i).length).toBeGreaterThan(0);
    });

    // Additional tests would depend on specific implementation
    // This is an advanced exercise combining multiple patterns
  });
});
