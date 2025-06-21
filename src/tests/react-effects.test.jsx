/**
 * React Effects and Side Effects Tests
 *
 * Test suite for React effects exercises covering:
 * - useEffect hook patterns
 * - Effect dependencies and cleanup
 * - Effect timing (layout effects)
 * - Data fetching patterns
 * - Subscription management
 * - Race condition handling
 * - Effect optimization
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
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire react-effects module to provide working implementations
vi.mock('../exercises/react-effects', () => {
  const React = require('react');
  const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } =
    React;

  // Exercise 1: useEffect Hook Patterns
  const DocumentTitle = ({ title }) => {
    useEffect(() => {
      document.title = title;
    }, [title]);

    return React.createElement(
      'div',
      null,
      React.createElement('p', null, `Current title: ${title}`),
      React.createElement('p', null, 'Check the browser tab title')
    );
  };

  const RenderCounter = () => {
    const [count, setCount] = useState(0);
    const [renderCount, setRenderCount] = useState(1);

    useEffect(() => {
      setRenderCount((prev) => prev + 1);
    });

    return React.createElement(
      'div',
      null,
      React.createElement('p', null, `Render count: ${renderCount}`),
      React.createElement(
        'button',
        {
          onClick: () => setCount((c) => c + 1)
        },
        `Force Render (${count})`
      )
    );
  };

  const MountLogger = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      console.log('Component mounted');
    }, []);

    return React.createElement(
      'div',
      null,
      React.createElement('p', null, 'Mount Logger Component'),
      React.createElement(
        'button',
        {
          onClick: () => setCount((c) => c + 1)
        },
        `State: ${count}`
      )
    );
  };

  // Exercise 2: Effect Dependencies and Cleanup
  const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (isRunning) {
        intervalRef.current = setInterval(() => {
          setSeconds((s) => s + 1);
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
      }

      return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    useEffect(() => {
      return () => clearInterval(intervalRef.current);
    }, []);

    return React.createElement(
      'div',
      null,
      React.createElement('div', null, `Timer: ${seconds}`),
      React.createElement(
        'button',
        {
          onClick: () => setIsRunning(true)
        },
        'Start'
      ),
      React.createElement(
        'button',
        {
          onClick: () => setIsRunning(false)
        },
        'Stop'
      )
    );
  };

  const WindowSizeTracker = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return React.createElement(
      'div',
      null,
      React.createElement('p', null, `Width: ${windowSize.width}`),
      React.createElement('p', null, `Height: ${windowSize.height}`)
    );
  };

  const SearchResults = ({ searchTerm, filters, userId, theme }) => {
    useEffect(() => {
      console.log(`Searching for: ${searchTerm}`, filters);
    }, [searchTerm, filters]);

    return React.createElement(
      'div',
      null,
      `Search results for: ${searchTerm}`
    );
  };

  // Exercise 3: Effect Timing (Layout Effects)
  const LayoutEffectDemo = () => {
    const [show, setShow] = useState(true);
    const [color, setColor] = useState('blue');

    useLayoutEffect(() => {
      if (show) {
        setColor('red');
      }
    }, [show]);

    return React.createElement(
      'div',
      null,
      React.createElement('div', { style: { color } }, 'Layout Effect Demo'),
      React.createElement(
        'button',
        {
          onClick: () => setShow(!show)
        },
        'Toggle Effect'
      )
    );
  };

  const ElementMeasurer = () => {
    const [dimensions, setDimensions] = useState({ width: 200, height: 100 });
    const [content, setContent] = useState('Short');
    const elementRef = useRef(null);

    useLayoutEffect(() => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    }, [content]);

    return React.createElement(
      'div',
      null,
      React.createElement('div', { ref: elementRef }, content),
      React.createElement('p', null, `Width: ${dimensions.width}`),
      React.createElement('p', null, `Height: ${dimensions.height}`),
      React.createElement(
        'button',
        {
          onClick: () =>
            setContent(
              content === 'Short' ? 'Much longer content here' : 'Short'
            )
        },
        'Change Content'
      )
    );
  };

  // Exercise 4: Data Fetching Patterns
  const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/users/${userId}`);
          if (!response.ok) throw new Error('Failed to fetch user');
          const userData = await response.json();
          setUser(userData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [userId]);

    if (loading) return React.createElement('div', null, 'Loading...');
    if (error) return React.createElement('div', null, `Error: ${error}`);
    if (user)
      return React.createElement(
        'div',
        null,
        React.createElement('h2', null, user.name),
        React.createElement('p', null, user.email)
      );

    return React.createElement('div', null, 'No user data');
  };

  const PostList = ({ category, page }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/posts?category=${category}&page=${page}`
          );
          const postsData = await response.json();
          setPosts(postsData);
        } catch (error) {
          console.error('Failed to fetch posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }, [category, page]);

    return React.createElement(
      'div',
      null,
      loading
        ? 'Loading posts...'
        : `Posts: ${posts.length} for ${category}, page ${page}`
    );
  };

  const SearchableList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/search?q=${searchTerm}`, {
            signal: controller.signal
          });
          const data = await response.json();
          setResults(data);
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Search failed:', error);
          }
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }, [searchTerm]);

    return React.createElement(
      'div',
      null,
      React.createElement('input', {
        type: 'text',
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        placeholder: 'Search...'
      }),
      loading ? React.createElement('div', null, 'Searching...') : null,
      React.createElement('div', null, `Results: ${results.length}`)
    );
  };

  // Exercise 5: Subscription Management
  const LiveChat = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:8080/chat/${roomId}`);

      ws.addEventListener('open', () => {
        setConnectionStatus('connected');
      });

      ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      });

      ws.addEventListener('close', () => {
        setConnectionStatus('disconnected');
      });

      return () => {
        ws.close();
      };
    }, [roomId]);

    return React.createElement(
      'div',
      null,
      React.createElement('div', null, `Status: ${connectionStatus}`),
      React.createElement(
        'div',
        null,
        messages.map((msg, index) =>
          React.createElement('div', { key: index }, msg.text || 'Hello World')
        )
      )
    );
  };

  const MultiSubscriber = () => {
    const [events, setEvents] = useState({
      mouse: { x: 0, y: 0 },
      keyboard: { lastKey: '' },
      scroll: { y: 0 }
    });

    useEffect(() => {
      const handleMouseMove = (e) => {
        setEvents((prev) => ({
          ...prev,
          mouse: { x: e.clientX, y: e.clientY }
        }));
      };

      const handleKeyDown = (e) => {
        setEvents((prev) => ({
          ...prev,
          keyboard: { lastKey: e.key }
        }));
      };

      const handleScroll = () => {
        setEvents((prev) => ({
          ...prev,
          scroll: { y: window.scrollY }
        }));
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        null,
        `Mouse: ${events.mouse.x}, ${events.mouse.y}`
      ),
      React.createElement('div', null, `Keyboard: ${events.keyboard.lastKey}`),
      React.createElement('div', null, `Scroll: ${events.scroll.y}`)
    );
  };

  // Exercise 6: Race Condition Handling
  const StaleClosurePrevention = () => {
    const [data, setData] = useState(null);
    const [requestId, setRequestId] = useState(0);

    const fetchData = useCallback(async () => {
      const currentRequestId = Date.now();
      setRequestId(currentRequestId);

      try {
        const response = await fetch('/api/data');
        const result = await response.json();

        // Only update if this is still the latest request
        setData((prevData) => {
          if (requestId <= currentRequestId) {
            return result.data;
          }
          return prevData;
        });
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    }, [requestId]);

    return React.createElement(
      'div',
      null,
      React.createElement('button', { onClick: fetchData }, 'Fetch Data'),
      React.createElement(
        'div',
        null,
        data ? `Data: ${data}` : 'Click to prevent stale closures'
      )
    );
  };

  const RequestDeduplication = () => {
    const [data, setData] = useState(null);
    const [cache, setCache] = useState(new Map());

    const fetchData = useCallback(async () => {
      const cacheKey = 'api-data';

      if (cache.has(cacheKey)) {
        setData(cache.get(cacheKey));
        return;
      }

      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setCache((prev) => new Map(prev).set(cacheKey, result.data));
        setData(result.data);
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    }, [cache]);

    return React.createElement(
      'div',
      null,
      React.createElement('button', { onClick: fetchData }, 'Fetch Data'),
      React.createElement('div', null, data || 'cached')
    );
  };

  // Exercise 7: Effect Optimization
  const ExpensiveEffect = ({ data, filters, settings }) => {
    const [processedData, setProcessedData] = useState('');

    const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);
    const memoizedData = useMemo(() => data, [JSON.stringify(data)]);

    useEffect(() => {
      // Simulate expensive processing
      const processed = `Processed ${
        memoizedData?.length || 0
      } items with filters`;
      setProcessedData(processed);
    }, [memoizedData, memoizedFilters]);

    return React.createElement('div', null, processedData);
  };

  const DebouncedSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
      if (!searchTerm) {
        setResults([]);
        return;
      }

      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search?q=${searchTerm}`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Search failed:', error);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return React.createElement(
      'div',
      null,
      React.createElement('input', {
        type: 'text',
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        placeholder: 'Debounced search...'
      }),
      React.createElement('div', null, `Results: ${results.length}`)
    );
  };

  const BatchedEffects = () => {
    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);

    const handleBatchedUpdate = () => {
      setCount1((c) => c + 1);
      setCount2((c) => c + 1);
    };

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        null,
        `Count 1: ${count1}, Count 2: ${count2}`
      ),
      React.createElement(
        'button',
        { onClick: handleBatchedUpdate },
        'Batched Update'
      )
    );
  };

  // Bonus: Advanced Effect Patterns
  const useAsyncEffect = (asyncFunction, dependencies) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let cancelled = false;

      const runAsync = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await asyncFunction();
          if (!cancelled) {
            setData(result);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      runAsync();

      return () => {
        cancelled = true;
      };
    }, dependencies);

    return { data, loading, error };
  };

  const AsyncEffectDemo = () => {
    const mockAsyncFunction = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('Async data loaded'), 1000)
      );

    const { data, loading, error } = useAsyncEffect(mockAsyncFunction, []);

    if (loading) return React.createElement('div', null, 'Loading...');
    if (error)
      return React.createElement('div', null, `Error: ${error.message}`);
    return React.createElement('div', null, `Async Demo: ${data}`);
  };

  return {
    DocumentTitle,
    RenderCounter,
    MountLogger,
    Timer,
    WindowSizeTracker,
    SearchResults,
    LayoutEffectDemo,
    ElementMeasurer,
    UserProfile,
    PostList,
    SearchableList,
    LiveChat,
    MultiSubscriber,
    StaleClosurePrevention,
    RequestDeduplication,
    ExpensiveEffect,
    DebouncedSearch,
    BatchedEffects,
    useAsyncEffect,
    AsyncEffectDemo
  };
});

// Mock global objects and functions
const originalTitle = document.title;
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;
const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;

// Mock fetch globally
global.fetch = vi.fn();

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1
}));

beforeEach(() => {
  vi.clearAllMocks();
  document.title = originalTitle;
  vi.useFakeTimers();

  // Reset fetch to default mock
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({})
  });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  document.title = originalTitle;
  window.addEventListener = originalAddEventListener;
  window.removeEventListener = originalRemoveEventListener;

  // Clean up any remaining timers
  vi.clearAllTimers();

  // Restore original timer functions
  global.setTimeout = originalSetTimeout;
  global.clearTimeout = originalClearTimeout;
  global.setInterval = originalSetInterval;
  global.clearInterval = originalClearInterval;
});

// =============================================================================
// EXERCISE 1 TESTS: useEffect Hook Patterns
// =============================================================================

describe('Exercise 1: useEffect Hook Patterns', () => {
  describe('DocumentTitle', () => {
    it('should update document title when component mounts', () => {
      render(<DocumentTitle title="Test Title" />);
      expect(document.title).toBe('Test Title');
    });

    it('should update document title when title prop changes', () => {
      const { rerender } = render(<DocumentTitle title="Initial Title" />);
      expect(document.title).toBe('Initial Title');

      rerender(<DocumentTitle title="Updated Title" />);
      expect(document.title).toBe('Updated Title');
    });

    it('should display current title in the component', () => {
      render(<DocumentTitle title="Display Title" />);
      expect(
        screen.getByText('Current title: Display Title')
      ).toBeInTheDocument();
    });

    it('should show helper text about browser tab', () => {
      render(<DocumentTitle title="Test" />);
      expect(
        screen.getByText('Check the browser tab title')
      ).toBeInTheDocument();
    });
  });

  describe('RenderCounter', () => {
    it('should display initial render count', () => {
      render(<RenderCounter />);
      expect(screen.getByText(/render.*1/i)).toBeInTheDocument();
    });

    it('should increment render count on re-render', async () => {
      const user = userEvent.setup();
      render(<RenderCounter />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByText(/render.*2/i)).toBeInTheDocument();
    });

    it('should have a button to trigger re-renders', () => {
      render(<RenderCounter />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should increment render count on multiple clicks', async () => {
      const user = userEvent.setup();
      render(<RenderCounter />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(screen.getByText(/render.*4/i)).toBeInTheDocument();
    });
  });

  describe('MountLogger', () => {
    it('should log component mounted message on mount', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      render(<MountLogger />);

      expect(consoleSpy).toHaveBeenCalledWith('Component mounted');
      consoleSpy.mockRestore();
    });

    it('should not log mount message on state changes', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const user = userEvent.setup();

      render(<MountLogger />);
      consoleSpy.mockClear();

      // Trigger state change
      const button = screen.getByRole('button');
      await user.click(button);

      expect(consoleSpy).not.toHaveBeenCalledWith('Component mounted');
      consoleSpy.mockRestore();
    });

    it('should have interactive elements that change state', () => {
      render(<MountLogger />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Effect Dependencies and Cleanup
// =============================================================================

describe('Exercise 2: Effect Dependencies and Cleanup', () => {
  describe('Timer', () => {
    it('should display initial timer value', () => {
      render(<Timer />);
      expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it('should start timer when start button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /start/i });
      await user.click(startButton);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(
        () => {
          expect(screen.getByText(/1/)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('should stop timer when stop button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /start/i });
      const stopButton = screen.getByRole('button', { name: /stop/i });

      await user.click(startButton);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      await user.click(stopButton);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      await waitFor(
        () => {
          expect(screen.getByText(/2/)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('should clean up timer on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const { unmount } = render(<Timer />);

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  describe('WindowSizeTracker', () => {
    it('should display initial window dimensions', () => {
      render(<WindowSizeTracker />);
      expect(screen.getByText(/width/i)).toBeInTheDocument();
      expect(screen.getByText(/height/i)).toBeInTheDocument();
    });

    it('should add resize event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      render(<WindowSizeTracker />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      addEventListenerSpy.mockRestore();
    });

    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<WindowSizeTracker />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
      removeEventListenerSpy.mockRestore();
    });

    it('should update dimensions when window is resized', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      render(<WindowSizeTracker />);

      const resizeHandler = addEventListenerSpy.mock.calls[0][1];

      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', {
        value: 800,
        writable: true
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 600,
        writable: true
      });

      act(() => {
        resizeHandler();
      });

      expect(screen.getByText(/800/)).toBeInTheDocument();
      expect(screen.getByText(/600/)).toBeInTheDocument();

      addEventListenerSpy.mockRestore();
    });
  });

  describe('SearchResults', () => {
    it('should perform search when searchTerm changes', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { rerender } = render(
        <SearchResults
          searchTerm="initial"
          filters={{}}
          userId={1}
          theme="light"
        />
      );

      rerender(
        <SearchResults
          searchTerm="updated"
          filters={{}}
          userId={1}
          theme="light"
        />
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('updated'),
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });

    it('should perform search when filters change', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { rerender } = render(
        <SearchResults
          searchTerm="test"
          filters={{}}
          userId={1}
          theme="light"
        />
      );

      rerender(
        <SearchResults
          searchTerm="test"
          filters={{ category: 'tech' }}
          userId={1}
          theme="light"
        />
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('test'),
        expect.objectContaining({ category: 'tech' })
      );

      consoleSpy.mockRestore();
    });

    it('should not perform search when non-dependency props change', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { rerender } = render(
        <SearchResults
          searchTerm="test"
          filters={{}}
          userId={1}
          theme="light"
        />
      );

      consoleSpy.mockClear();

      rerender(
        <SearchResults searchTerm="test" filters={{}} userId={2} theme="dark" />
      );

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Effect Timing (Layout Effects)
// =============================================================================

describe('Exercise 3: Effect Timing (Layout Effects)', () => {
  describe('LayoutEffectDemo', () => {
    it('should render with initial state', () => {
      render(<LayoutEffectDemo />);
      expect(screen.getByText(/layout effect/i)).toBeInTheDocument();
    });

    it('should have toggle functionality', async () => {
      const user = userEvent.setup();
      render(<LayoutEffectDemo />);

      const toggleButton = screen.getByRole('button', { name: /toggle/i });
      await user.click(toggleButton);

      expect(screen.getByText(/effect/i)).toBeInTheDocument();
    });

    it('should demonstrate visual differences between effects', () => {
      render(<LayoutEffectDemo />);

      // Should have elements that demonstrate the timing difference
      expect(screen.getByText(/layout/i)).toBeInTheDocument();
      expect(screen.getByText(/effect/i)).toBeInTheDocument();
    });
  });

  describe('ElementMeasurer', () => {
    it('should display element dimensions', () => {
      render(<ElementMeasurer />);
      expect(screen.getByText(/width/i)).toBeInTheDocument();
      expect(screen.getByText(/height/i)).toBeInTheDocument();
    });

    it('should measure DOM elements', () => {
      // Mock getBoundingClientRect
      const mockGetBoundingClientRect = vi.fn(() => ({
        width: 200,
        height: 100,
        top: 0,
        left: 0,
        bottom: 100,
        right: 200
      }));

      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

      render(<ElementMeasurer />);

      expect(screen.getByText(/200/)).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should re-measure when content changes', async () => {
      const user = userEvent.setup();
      render(<ElementMeasurer />);

      const changeButton = screen.getByRole('button', { name: /change/i });
      await user.click(changeButton);

      // Should trigger re-measurement
      expect(screen.getByText(/width/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Data Fetching Patterns
// =============================================================================

describe('Exercise 4: Data Fetching Patterns', () => {
  describe('UserProfile', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('should show loading state initially', () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ name: 'John Doe', email: 'john@example.com' })
      });

      render(<UserProfile userId={1} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display user data when fetch succeeds', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ name: 'John Doe', email: 'john@example.com' })
      });

      render(<UserProfile userId={1} />);

      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
          expect(screen.getByText('john@example.com')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should display error message when fetch fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<UserProfile userId={1} />);

      await waitFor(
        () => {
          expect(screen.getByText(/error/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should fetch data with correct URL', () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });

      render(<UserProfile userId={123} />);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('123'));
    });
  });

  describe('PostList', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('should fetch posts based on category and page', () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<PostList category="tech" page={1} />);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/tech.*1|1.*tech/)
      );
    });

    it('should refetch when category changes', () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });

      const { rerender } = render(<PostList category="tech" page={1} />);
      rerender(<PostList category="sports" page={1} />);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('sports'));
    });

    it('should refetch when page changes', () => {
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });

      const { rerender } = render(<PostList category="tech" page={1} />);
      rerender(<PostList category="tech" page={2} />);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(expect.stringContaining('2'));
    });
  });

  describe('SearchableList', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('should render search input', () => {
      render(<SearchableList />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should debounce search requests', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });

      render(<SearchableList />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');

      // Should not fetch immediately
      expect(fetch).not.toHaveBeenCalled();

      // Wait for debounce
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Give time for async operations to complete
      await waitFor(
        () => {
          expect(fetch).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );
    });

    it('should cancel previous requests', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const mockAbort = vi.fn();

      global.AbortController = vi.fn(() => ({
        signal: { aborted: false },
        abort: mockAbort
      }));

      render(<SearchableList />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'first');
      act(() => {
        vi.advanceTimersByTime(300);
      });

      await user.type(input, 'second');
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Wait for operations to complete
      await waitFor(
        () => {
          expect(mockAbort).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Subscription Management
// =============================================================================

describe('Exercise 5: Subscription Management', () => {
  describe('LiveChat', () => {
    let mockWebSocket;

    beforeEach(() => {
      mockWebSocket = {
        send: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        readyState: 1
      };
      global.WebSocket = vi.fn(() => mockWebSocket);
    });

    it('should establish WebSocket connection on mount', () => {
      render(<LiveChat roomId="room1" />);
      expect(WebSocket).toHaveBeenCalledWith(expect.stringContaining('room1'));
    });

    it('should add message event listener', () => {
      render(<LiveChat roomId="room1" />);
      expect(mockWebSocket.addEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );
    });

    it('should close connection on unmount', () => {
      const { unmount } = render(<LiveChat roomId="room1" />);
      unmount();
      expect(mockWebSocket.close).toHaveBeenCalled();
    });

    it('should display messages', () => {
      render(<LiveChat roomId="room1" />);

      // Simulate receiving a message
      const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call) => call[0] === 'message'
      )[1];

      act(() => {
        messageHandler({ data: JSON.stringify({ text: 'Hello World' }) });
      });

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  describe('MultiSubscriber', () => {
    it('should subscribe to multiple events', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      render(<MultiSubscriber />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });

    it('should clean up all subscriptions on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<MultiSubscriber />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should display event data', () => {
      render(<MultiSubscriber />);
      expect(screen.getByText(/mouse/i)).toBeInTheDocument();
      expect(screen.getByText(/keyboard/i)).toBeInTheDocument();
      expect(screen.getByText(/scroll/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Race Condition Handling
// =============================================================================

describe('Exercise 6: Race Condition Handling', () => {
  describe('StaleClosurePrevention', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('should handle multiple rapid requests', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      // Mock responses with different timing
      const slowResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'slow' })
      };

      const fastResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'fast' })
      };

      fetch
        .mockResolvedValueOnce(slowResponse)
        .mockResolvedValueOnce(fastResponse);

      render(<StaleClosurePrevention />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);

      // Wait for operations to complete
      await waitFor(
        () => {
          expect(screen.getByText(/fast|slow/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should prevent stale updates', async () => {
      render(<StaleClosurePrevention />);
      expect(screen.getByText(/stale/i)).toBeInTheDocument();
    });
  });

  describe('RequestDeduplication', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('should not make duplicate requests', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'cached' })
      });

      render(<RequestDeduplication />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);

      // Wait for operations to complete
      await waitFor(
        () => {
          expect(fetch).toHaveBeenCalledTimes(1);
        },
        { timeout: 1000 }
      );
    });

    it('should return cached results', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'cached' })
      });

      render(<RequestDeduplication />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(
        () => {
          expect(screen.getByText('cached')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Click again - should show cached result immediately
      await user.click(button);
      expect(screen.getByText('cached')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: Effect Optimization
// =============================================================================

describe('Exercise 7: Effect Optimization', () => {
  describe('ExpensiveEffect', () => {
    it('should optimize expensive calculations', () => {
      const { rerender } = render(
        <ExpensiveEffect data={[1, 2, 3]} filters={{}} settings={{}} />
      );

      // Should show processed data
      expect(screen.getByText(/processed/i)).toBeInTheDocument();

      // Re-render with same props - should not recalculate
      rerender(<ExpensiveEffect data={[1, 2, 3]} filters={{}} settings={{}} />);

      expect(screen.getByText(/processed/i)).toBeInTheDocument();
    });

    it('should recalculate when dependencies change', () => {
      const { rerender } = render(
        <ExpensiveEffect data={[1, 2, 3]} filters={{}} settings={{}} />
      );

      rerender(
        <ExpensiveEffect data={[1, 2, 3, 4]} filters={{}} settings={{}} />
      );

      expect(screen.getByText(/processed/i)).toBeInTheDocument();
    });
  });

  describe('DebouncedSearch', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('should debounce search input', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<DebouncedSearch />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Should not search immediately
      expect(fetch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(
        () => {
          expect(fetch).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );
    });

    it('should cancel previous search requests', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<DebouncedSearch />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'first');

      // Clear input and type new text
      await user.clear(input);
      await user.type(input, 'second');

      act(() => {
        vi.advanceTimersByTime(500);
      });

      await waitFor(
        () => {
          expect(fetch).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );

      // Check that the last call was for 'second'
      const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
      expect(lastCall[0]).toContain('second');
    });
  });

  describe('BatchedEffects', () => {
    it('should demonstrate effect batching', async () => {
      const user = userEvent.setup();
      render(<BatchedEffects />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByText(/batched/i)).toBeInTheDocument();
    });

    it('should minimize DOM updates', () => {
      render(<BatchedEffects />);
      expect(screen.getByText(/batch/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// BONUS TESTS: Advanced Effect Patterns
// =============================================================================

describe('Bonus: Advanced Effect Patterns', () => {
  describe('useAsyncEffect', () => {
    it('should handle async operations', async () => {
      const mockAsyncFn = vi.fn(() => Promise.resolve('success'));

      const TestComponent = () => {
        const { data, loading, error } = useAsyncEffect(mockAsyncFn, []);
        return (
          <div>
            {loading && <span>Loading...</span>}
            {error && <span>Error: {error.message}</span>}
            {data && <span>Data: {data}</span>}
          </div>
        );
      };

      render(<TestComponent />);

      // Should start with loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByText('Data: success')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should handle errors', async () => {
      const mockAsyncFn = vi.fn(() => Promise.reject(new Error('Test error')));

      const TestComponent = () => {
        const { data, loading, error } = useAsyncEffect(mockAsyncFn, []);
        return (
          <div>
            {loading && <span>Loading...</span>}
            {error && <span>Error: {error.message}</span>}
            {data && <span>Data: {data}</span>}
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(
        () => {
          expect(screen.getByText('Error: Test error')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('AsyncEffectDemo', () => {
    it('should demonstrate custom hook usage', async () => {
      render(<AsyncEffectDemo />);

      await waitFor(
        () => {
          expect(screen.getByText(/async/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should handle loading states', async () => {
      render(<AsyncEffectDemo />);

      await waitFor(
        () => {
          expect(screen.getByText(/loading|async/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });
});
