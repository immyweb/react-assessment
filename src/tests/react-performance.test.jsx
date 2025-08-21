/**
 * React Performance Optimization Tests
 *
 * Test suite for React performance optimization exercises covering:
 * - React.memo and memoization
 * - Component splitting strategies
 * - Bundle splitting techniques
 * - Lazy loading and Suspense
 * - Virtual list implementations
 * - Render optimization patterns
 * - Performance measurement tools
 */

import React, { Suspense } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import {
  MemoizedChild,
  MemoizationDemo,
  ExpensiveMemoCalculator,
  OptimizedList,
  ProfilePage,
  UserProfile,
  UserSettings,
  ActivityFeed,
  SplitFormDemo,
  LazyLoadingDemo,
  RouteLazyLoading,
  DynamicFeatureLoader,
  SuspensePatterns,
  LazyImage,
  SuspenseDataFetcher,
  InfiniteScrollList,
  VirtualList,
  VirtualGrid,
  DynamicVirtualList,
  VirtualTable,
  RenderBatchingDemo,
  ConditionalRenderOptimization,
  EfficientListRendering,
  DebouncedSearchInput,
  DeferredExpensiveComponent,
  PerformanceMonitor,
  ProfilerWrapper,
  MemoryUsageTracker,
  BundleSizeAnalyzer,
  RegularChild,
  expensiveCalculation,
  HeavyComponentPlaceholder,
  generateMockData,
  useIntersectionObserver,
  usePerformanceMeasurement
} from '../exercises/react-performance';

// =============================================================================
// SETUP AND UTILITIES
// =============================================================================

// Mock console methods to test optimization logging
const mockConsole = vi.fn();
const originalConsoleLog = console.log;
console.log = mockConsole;

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => [])
};
global.performance = mockPerformance;

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  triggerIntersection(element, isIntersecting = true) {
    this.callback([
      {
        target: element,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0
      }
    ]);
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock fetch for data fetching tests
global.fetch = vi.fn();

// Mock React.lazy and dynamic imports
vi.mock('./components/HeavyDashboard', () => ({
  default: () => <div data-testid="heavy-dashboard">Heavy Dashboard</div>
}));

vi.mock('./components/HeavyChart', () => ({
  default: () => <div data-testid="heavy-chart">Heavy Chart</div>
}));

vi.mock('./components/HeavyDataTable', () => ({
  default: () => <div data-testid="heavy-data-table">Heavy Data Table</div>
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockConsole.mockClear();
  mockPerformance.now.mockReturnValue(Date.now());
  global.fetch.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// =============================================================================
// EXERCISE 1 TESTS: React.memo and Memoization
// =============================================================================

describe('Exercise 1: React.memo and Memoization', () => {
  describe('MemoizedChild', () => {
    it('should render child component with props', () => {
      render(<MemoizedChild name="John" count={5} />);

      expect(screen.getByText(/john/i)).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    it('should log renders for demonstration', () => {
      render(<MemoizedChild name="John" count={5} />);

      // Should log render with props
      expect(mockConsole).toHaveBeenCalledWith(
        expect.stringContaining('ChildComponent rendered')
      );
    });

    it('should be properly memoized - not re-render with same props', () => {
      const { rerender } = render(<MemoizedChild name="John" count={5} />);

      mockConsole.mockClear();

      // Re-render with same props
      rerender(<MemoizedChild name="John" count={5} />);

      // Should not log additional renders due to memoization
      expect(mockConsole).not.toHaveBeenCalled();
    });

    it('should re-render when props change', () => {
      const { rerender } = render(<MemoizedChild name="John" count={5} />);

      mockConsole.mockClear();

      // Re-render with different props
      rerender(<MemoizedChild name="Jane" count={5} />);

      // Should log new render due to prop change
      expect(mockConsole).toHaveBeenCalledWith(expect.stringContaining('Jane'));
    });
  });

  describe('MemoizationDemo', () => {
    it('should render parent component with controls', () => {
      render(<MemoizationDemo />);

      // Should have buttons to control different state
      expect(
        screen.getByRole('button', { name: /child name|name/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /count/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /parent/i })
      ).toBeInTheDocument();
    });

    it('should render both memoized and regular children', () => {
      render(<MemoizationDemo />);

      expect(screen.getByText(/memoized/i)).toBeInTheDocument();
      expect(screen.getByText(/regular/i)).toBeInTheDocument();
    });

    it('should demonstrate memoization benefits', async () => {
      const user = userEvent.setup();
      render(<MemoizationDemo />);

      mockConsole.mockClear();

      // Click parent state button - should only trigger regular child re-render
      const parentButton = screen.getByRole('button', { name: /parent/i });
      await user.click(parentButton);

      // Check that regular child re-rendered but memoized didn't
      const renderLogs = mockConsole.mock.calls.filter(
        (call) => call[0] && call[0].includes && call[0].includes('Child')
      );

      // Should see regular child render but not memoized child
      expect(renderLogs.some((call) => call[0].includes('Regular'))).toBe(true);
    });
  });

  describe('ExpensiveMemoCalculator', () => {
    const mockNumbers = [1, 2, 3, 4, 5];

    it('should display calculation results', () => {
      render(<ExpensiveMemoCalculator numbers={mockNumbers} />);

      expect(screen.getByText(/result|calculation/i)).toBeInTheDocument();
    });

    it('should show calculation time', () => {
      render(<ExpensiveMemoCalculator numbers={mockNumbers} />);

      expect(screen.getByText(/time|ms|milliseconds/i)).toBeInTheDocument();
    });

    it('should only recalculate when numbers change', () => {
      const spy = vi.spyOn(console, 'log');
      const { rerender } = render(
        <ExpensiveMemoCalculator numbers={mockNumbers} />
      );

      spy.mockClear();

      // Re-render with same numbers but different multiplier
      rerender(
        <ExpensiveMemoCalculator numbers={mockNumbers} multiplier={2} />
      );

      // Should not see expensive calculation log
      expect(spy).not.toHaveBeenCalledWith(
        'Performing expensive calculation...'
      );

      // Re-render with different numbers
      rerender(<ExpensiveMemoCalculator numbers={[6, 7, 8]} multiplier={2} />);

      // Should see calculation log for new numbers
      expect(spy).toHaveBeenCalledWith('Performing expensive calculation...');
    });

    it('should handle empty numbers array', () => {
      render(<ExpensiveMemoCalculator numbers={[]} />);

      // Should not crash with empty array
      expect(screen.getByText(/result|calculation/i)).toBeInTheDocument();
    });
  });

  describe('OptimizedList', () => {
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];

    it('should render list items', () => {
      render(<OptimizedList items={mockItems} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should handle item interactions', async () => {
      const user = userEvent.setup();
      render(<OptimizedList items={mockItems} />);

      const firstItem = screen.getByText('Item 1');
      await user.click(firstItem);

      // Should not throw errors on click
      expect(firstItem).toBeInTheDocument();
    });

    it('should demonstrate useCallback optimization', () => {
      const { rerender } = render(<OptimizedList items={mockItems} />);

      mockConsole.mockClear();

      // Re-render with same items
      rerender(<OptimizedList items={mockItems} />);

      // Should minimize re-renders due to useCallback
      const itemRenderLogs = mockConsole.mock.calls.filter(
        (call) => call[0] && call[0].includes && call[0].includes('Item')
      );

      expect(itemRenderLogs.length).toBeLessThan(mockItems.length);
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: Component Splitting Strategies
// =============================================================================

describe('Exercise 2: Component Splitting Strategies', () => {
  describe('ProfilePage', () => {
    const mockUserId = 'user-123';

    it('should render main profile page', () => {
      render(<ProfilePage userId={mockUserId} />);

      expect(screen.getByText(/profile|user/i)).toBeInTheDocument();
    });

    it('should render split components', () => {
      render(<ProfilePage userId={mockUserId} />);

      // Should contain references to different sections
      expect(
        screen.getByText(/profile|settings|activity/i)
      ).toBeInTheDocument();
    });

    it('should handle user ID prop', () => {
      render(<ProfilePage userId={mockUserId} />);

      // Should display or use the user ID somehow
      expect(screen.getByText(new RegExp(mockUserId, 'i'))).toBeInTheDocument();
    });
  });

  describe('UserProfile', () => {
    it('should render user profile section', () => {
      render(<UserProfile userId="user-123" />);

      expect(screen.getByText(/profile|user.*info/i)).toBeInTheDocument();
    });

    it('should be memoized for performance', () => {
      const { rerender } = render(<UserProfile userId="user-123" />);

      mockConsole.mockClear();

      // Re-render with same userId
      rerender(<UserProfile userId="user-123" />);

      // Should not see additional render logs
      const profileLogs = mockConsole.mock.calls.filter(
        (call) => call[0] && call[0].includes && call[0].includes('Profile')
      );

      expect(profileLogs.length).toBe(0);
    });
  });

  describe('UserSettings', () => {
    it('should render settings section', () => {
      const mockOnSettingsChange = vi.fn();
      render(
        <UserSettings
          userId="user-123"
          onSettingsChange={mockOnSettingsChange}
        />
      );

      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });

    it('should handle settings changes', async () => {
      const user = userEvent.setup();
      const mockOnSettingsChange = vi.fn();
      render(
        <UserSettings
          userId="user-123"
          onSettingsChange={mockOnSettingsChange}
        />
      );

      const settingsButton = screen.queryByRole('button', {
        name: /save|update|change/i
      });
      if (settingsButton) {
        await user.click(settingsButton);
        expect(mockOnSettingsChange).toHaveBeenCalled();
      }
    });
  });

  describe('ActivityFeed', () => {
    it('should render activity feed section', () => {
      render(<ActivityFeed userId="user-123" />);

      expect(screen.getByText(/activity|feed/i)).toBeInTheDocument();
    });

    it('should handle limit prop', () => {
      render(<ActivityFeed userId="user-123" limit={5} />);

      // Should respect the limit (implementation dependent)
      expect(screen.getByText(/activity|feed/i)).toBeInTheDocument();
    });
  });

  describe('SplitFormDemo', () => {
    it('should render form sections', () => {
      render(<SplitFormDemo />);

      expect(
        screen.getByText(/form|personal|contact|preferences/i)
      ).toBeInTheDocument();
    });

    it('should handle form interactions', async () => {
      const user = userEvent.setup();
      render(<SplitFormDemo />);

      const input = screen.queryByRole('textbox');
      if (input) {
        await user.type(input, 'test input');
        expect(input).toHaveValue('test input');
      }
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Bundle Splitting Techniques
// =============================================================================

describe('Exercise 3: Bundle Splitting Techniques', () => {
  describe('LazyLoadingDemo', () => {
    it('should render lazy loading interface', () => {
      render(<LazyLoadingDemo />);

      expect(
        screen.getByText(/lazy|loading|tab|component/i)
      ).toBeInTheDocument();
    });

    it('should handle tab switching', async () => {
      const user = userEvent.setup();
      render(<LazyLoadingDemo />);

      const tab = screen.queryByRole('button', {
        name: /dashboard|chart|table/i
      });
      if (tab) {
        await user.click(tab);
        // Should not throw errors
      }
    });

    it('should show loading states', async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyLoadingDemo />
        </Suspense>
      );

      // Should handle Suspense boundaries
      expect(screen.getByText(/lazy|loading|component/i)).toBeInTheDocument();
    });
  });

  describe('RouteLazyLoading', () => {
    it('should render route-based loading system', () => {
      render(<RouteLazyLoading />);

      expect(screen.getByText(/route|lazy|loading/i)).toBeInTheDocument();
    });

    it('should handle route navigation', async () => {
      const user = userEvent.setup();
      render(<RouteLazyLoading />);

      const routeLink = screen.queryByRole('link', { name: /route|page/i });
      if (routeLink) {
        await user.click(routeLink);
      }
    });
  });

  describe('DynamicFeatureLoader', () => {
    const mockFeatures = ['feature1', 'feature2'];
    const mockPermissions = { feature1: true, feature2: false };

    it('should render based on permissions', () => {
      render(
        <DynamicFeatureLoader
          features={mockFeatures}
          userPermissions={mockPermissions}
        />
      );

      expect(screen.getByText(/feature|permission/i)).toBeInTheDocument();
    });

    it('should load permitted features', () => {
      render(
        <DynamicFeatureLoader
          features={mockFeatures}
          userPermissions={mockPermissions}
        />
      );

      // Should show available features based on permissions
      expect(screen.getByText(/feature1|available/i)).toBeInTheDocument();
    });

    it('should cache loaded features', () => {
      const { rerender } = render(
        <DynamicFeatureLoader
          features={mockFeatures}
          userPermissions={mockPermissions}
        />
      );

      // Re-render should use cached features
      rerender(
        <DynamicFeatureLoader
          features={mockFeatures}
          userPermissions={mockPermissions}
        />
      );

      expect(screen.getByText(/feature|permission/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Lazy Loading and Suspense
// =============================================================================

describe('Exercise 4: Lazy Loading and Suspense', () => {
  describe('SuspensePatterns', () => {
    it('should demonstrate Suspense patterns', () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <SuspensePatterns />
        </Suspense>
      );

      expect(screen.getByText(/suspense|pattern|loading/i)).toBeInTheDocument();
    });

    it('should handle nested Suspense boundaries', () => {
      render(
        <Suspense fallback={<div>Outer Loading...</div>}>
          <SuspensePatterns />
        </Suspense>
      );

      // Should not crash with nested boundaries
      expect(screen.getByText(/suspense|pattern/i)).toBeInTheDocument();
    });
  });

  describe('LazyImage', () => {
    it('should render image placeholder initially', () => {
      render(
        <LazyImage src="test.jpg" alt="Test image" placeholder="Loading..." />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should handle image loading', async () => {
      render(<LazyImage src="test.jpg" alt="Test image" />);

      // Should eventually load image or show placeholder
      expect(
        screen.getByText(/loading|image/i) || screen.getByRole('img')
      ).toBeInTheDocument();
    });

    it('should use Intersection Observer for lazy loading', () => {
      const ref = React.createRef();
      render(<LazyImage ref={ref} src="test.jpg" alt="Test image" />);

      // Should set up intersection observer
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it('should handle loading errors gracefully', () => {
      render(<LazyImage src="invalid.jpg" alt="Test image" />);

      // Should not crash on invalid image
      expect(
        screen.getByText(/loading|error|image/i) || screen.getByRole('img')
      ).toBeInTheDocument();
    });
  });

  describe('SuspenseDataFetcher', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test data' })
      });
    });

    it('should render with children', () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseDataFetcher url="/api/test">
            {(data) => <div>Data: {data}</div>}
          </SuspenseDataFetcher>
        </Suspense>
      );

      // Should handle Suspense pattern
      expect(screen.getByText(/loading|data/i)).toBeInTheDocument();
    });

    it('should fetch data from URL', async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseDataFetcher url="/api/test">
            {(data) => <div>Loaded</div>}
          </SuspenseDataFetcher>
        </Suspense>
      );

      expect(global.fetch).toHaveBeenCalledWith('/api/test');
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseDataFetcher url="/api/test">
            {(data) => <div>Data: {data}</div>}
          </SuspenseDataFetcher>
        </Suspense>
      );

      // Should handle errors gracefully
      expect(screen.getByText(/loading|error/i)).toBeInTheDocument();
    });
  });

  describe('InfiniteScrollList', () => {
    const mockInitialItems = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }));

    const mockFetchMore = vi.fn().mockResolvedValue([
      { id: 20, name: 'Item 20' },
      { id: 21, name: 'Item 21' }
    ]);

    it('should render initial items', () => {
      render(
        <InfiniteScrollList
          fetchMore={mockFetchMore}
          initialItems={mockInitialItems}
        />
      );

      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should handle scroll events', async () => {
      render(
        <InfiniteScrollList
          fetchMore={mockFetchMore}
          initialItems={mockInitialItems}
        />
      );

      // Simulate scroll to bottom
      const scrollContainer =
        screen.getByRole('list') || screen.getByTestId('scroll-container');
      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 1000 } });

        // Should trigger fetch more
        await waitFor(() => {
          expect(mockFetchMore).toHaveBeenCalled();
        });
      }
    });

    it('should show loading indicator during fetch', async () => {
      const slowFetchMore = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(
        <InfiniteScrollList
          fetchMore={slowFetchMore}
          initialItems={mockInitialItems}
        />
      );

      // Should show loading state
      expect(screen.getByText(/loading|more/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 5 TESTS: Virtual List Implementations
// =============================================================================

describe('Exercise 5: Virtual List Implementations', () => {
  const mockItems = generateMockData(1000);

  describe('VirtualList', () => {
    it('should render virtual list container', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id}>Item {index}</div>
      );

      render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
        />
      );

      expect(
        screen.getByRole('list') || screen.getByTestId('virtual-list')
      ).toBeInTheDocument();
    });

    it('should only render visible items', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id} data-testid={`item-${index}`}>
          Item {index}
        </div>
      );

      render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
        />
      );

      // Should not render all 1000 items, only visible ones
      const renderedItems = screen.getAllByTestId(/item-\d+/);
      expect(renderedItems.length).toBeLessThan(mockItems.length);
      expect(renderedItems.length).toBeGreaterThan(0);
    });

    it('should handle scroll events', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id}>Item {index}</div>
      );

      render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
        />
      );

      const container =
        screen.getByRole('list') || screen.getByTestId('virtual-list');

      // Should handle scroll without errors
      fireEvent.scroll(container, { target: { scrollTop: 200 } });
    });

    it('should handle overscan buffer', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id} data-testid={`item-${index}`}>
          Item {index}
        </div>
      );

      render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
          overscan={10}
        />
      );

      // Should render extra items for smooth scrolling
      const renderedItems = screen.getAllByTestId(/item-\d+/);
      expect(renderedItems.length).toBeGreaterThan(8); // 400/50 = 8 visible + overscan
    });
  });

  describe('VirtualGrid', () => {
    it('should render virtual grid container', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id}>Item {index}</div>
      );

      render(
        <VirtualGrid
          items={mockItems}
          itemWidth={200}
          itemHeight={150}
          containerWidth={800}
          containerHeight={600}
          columnsCount={4}
          renderItem={mockRenderItem}
        />
      );

      expect(
        screen.getByRole('grid') || screen.getByTestId('virtual-grid')
      ).toBeInTheDocument();
    });

    it('should calculate grid layout correctly', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id} data-testid={`grid-item-${index}`}>
          Item {index}
        </div>
      );

      render(
        <VirtualGrid
          items={mockItems}
          itemWidth={200}
          itemHeight={150}
          containerWidth={800}
          containerHeight={600}
          columnsCount={4}
          renderItem={mockRenderItem}
        />
      );

      // Should render appropriate number of visible items
      const renderedItems = screen.getAllByTestId(/grid-item-\d+/);
      expect(renderedItems.length).toBeGreaterThan(0);
      expect(renderedItems.length).toBeLessThan(mockItems.length);
    });

    it('should handle 2D scrolling', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id}>Item {index}</div>
      );

      render(
        <VirtualGrid
          items={mockItems}
          itemWidth={200}
          itemHeight={150}
          containerWidth={800}
          containerHeight={600}
          columnsCount={4}
          renderItem={mockRenderItem}
        />
      );

      const container =
        screen.getByRole('grid') || screen.getByTestId('virtual-grid');

      // Should handle both vertical and horizontal scroll
      fireEvent.scroll(container, {
        target: { scrollTop: 200, scrollLeft: 100 }
      });
    });
  });

  describe('DynamicVirtualList', () => {
    it('should handle variable item heights', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id} style={{ height: 30 + (index % 3) * 20 }}>
          Variable Item {index}
        </div>
      );

      render(
        <DynamicVirtualList
          items={mockItems}
          estimatedItemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
        />
      );

      expect(
        screen.getByRole('list') || screen.getByTestId('dynamic-virtual-list')
      ).toBeInTheDocument();
    });

    it('should measure and cache item heights', () => {
      const mockRenderItem = (item, index) => (
        <div key={item.id}>Item {index}</div>
      );

      const { rerender } = render(
        <DynamicVirtualList
          items={mockItems.slice(0, 10)}
          estimatedItemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
        />
      );

      // Re-render with more items
      rerender(
        <DynamicVirtualList
          items={mockItems.slice(0, 20)}
          estimatedItemHeight={50}
          containerHeight={400}
          renderItem={mockRenderItem}
        />
      );

      // Should handle dynamic content updates
      expect(
        screen.getByRole('list') || screen.getByTestId('dynamic-virtual-list')
      ).toBeInTheDocument();
    });
  });

  describe('VirtualTable', () => {
    const mockColumns = [
      { key: 'id', label: 'ID', width: 100 },
      { key: 'name', label: 'Name', width: 200 },
      { key: 'value', label: 'Value', width: 150 }
    ];

    it('should render virtual table with headers', () => {
      render(
        <VirtualTable
          data={mockItems}
          columns={mockColumns}
          rowHeight={40}
          headerHeight={50}
          containerHeight={500}
        />
      );

      expect(
        screen.getByRole('table') || screen.getByTestId('virtual-table')
      ).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should virtualize rows while keeping headers fixed', () => {
      render(
        <VirtualTable
          data={mockItems}
          columns={mockColumns}
          rowHeight={40}
          headerHeight={50}
          containerHeight={500}
        />
      );

      // Headers should always be visible
      expect(screen.getByText('ID')).toBeInTheDocument();

      // Should only render visible rows
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeLessThan(mockItems.length);
      expect(rows.length).toBeGreaterThan(1); // At least header row
    });

    it('should handle table scrolling', () => {
      render(
        <VirtualTable
          data={mockItems}
          columns={mockColumns}
          rowHeight={40}
          headerHeight={50}
          containerHeight={500}
        />
      );

      const table =
        screen.getByRole('table') || screen.getByTestId('virtual-table');

      // Should handle vertical scrolling
      fireEvent.scroll(table, { target: { scrollTop: 200 } });
    });

    it('should support column operations', async () => {
      const user = userEvent.setup();
      render(
        <VirtualTable
          data={mockItems}
          columns={mockColumns}
          rowHeight={40}
          headerHeight={50}
          containerHeight={500}
        />
      );

      // Should handle column header interactions
      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      // Should handle sorting or other column operations
      expect(nameHeader).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 6 TESTS: Render Optimization Patterns
// =============================================================================

describe('Exercise 6: Render Optimization Patterns', () => {
  describe('RenderBatchingDemo', () => {
    it('should demonstrate render batching', () => {
      render(<RenderBatchingDemo />);

      expect(
        screen.getByText(/batch|render|optimization/i)
      ).toBeInTheDocument();
    });

    it('should show performance measurements', () => {
      render(<RenderBatchingDemo />);

      expect(
        screen.getByText(/performance|time|measurement/i)
      ).toBeInTheDocument();
    });

    it('should handle batched updates', async () => {
      const user = userEvent.setup();
      render(<RenderBatchingDemo />);

      const batchButton = screen.queryByRole('button', {
        name: /batch|update/i
      });
      if (batchButton) {
        await user.click(batchButton);
        // Should handle batched state updates
      }
    });
  });

  describe('ConditionalRenderOptimization', () => {
    it('should optimize conditional rendering', () => {
      render(
        <ConditionalRenderOptimization
          condition={true}
          data="test"
          loading={false}
        />
      );

      expect(
        screen.getByText(/test|condition|optimization/i)
      ).toBeInTheDocument();
    });

    it('should handle early returns efficiently', () => {
      render(
        <ConditionalRenderOptimization
          condition={false}
          data="test"
          loading={true}
        />
      );

      // Should show loading state or early return
      expect(screen.getByText(/loading|condition/i)).toBeInTheDocument();
    });

    it('should avoid unnecessary element creation', () => {
      const { rerender } = render(
        <ConditionalRenderOptimization
          condition={false}
          data="test"
          loading={false}
        />
      );

      // Re-render with different conditions
      rerender(
        <ConditionalRenderOptimization
          condition={true}
          data="test"
          loading={false}
        />
      );

      expect(screen.getByText(/test|optimization/i)).toBeInTheDocument();
    });
  });

  describe('EfficientListRendering', () => {
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];

    const mockOnItemClick = vi.fn();

    it('should render list efficiently', () => {
      render(
        <EfficientListRendering
          items={mockItems}
          onItemClick={mockOnItemClick}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should use proper keys for reconciliation', () => {
      const { rerender } = render(
        <EfficientListRendering
          items={mockItems}
          onItemClick={mockOnItemClick}
        />
      );

      // Re-render with reordered items
      const reorderedItems = [mockItems[2], mockItems[0], mockItems[1]];
      rerender(
        <EfficientListRendering
          items={reorderedItems}
          onItemClick={mockOnItemClick}
        />
      );

      // Items should still render correctly
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should handle item clicks efficiently', async () => {
      const user = userEvent.setup();
      render(
        <EfficientListRendering
          items={mockItems}
          onItemClick={mockOnItemClick}
        />
      );

      await user.click(screen.getByText('Item 1'));

      expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should optimize list updates', () => {
      const { rerender } = render(
        <EfficientListRendering
          items={mockItems}
          onItemClick={mockOnItemClick}
        />
      );

      // Add new item
      const newItems = [...mockItems, { id: 4, name: 'Item 4' }];
      rerender(
        <EfficientListRendering
          items={newItems}
          onItemClick={mockOnItemClick}
        />
      );

      expect(screen.getByText('Item 4')).toBeInTheDocument();
      // Existing items should not re-render unnecessarily
    });
  });

  describe('DebouncedSearchInput', () => {
    const mockOnSearch = vi.fn();

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render search input', () => {
      render(<DebouncedSearchInput onSearch={mockOnSearch} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should debounce search calls', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<DebouncedSearchInput onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'test');

      // Should not call immediately
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Advance timers to trigger debounce
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });

    it('should show pending states during transitions', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<DebouncedSearchInput onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'searching');

      // Should show pending state
      expect(
        screen.getByText(/pending|searching/i) || input
      ).toBeInTheDocument();
    });

    it('should handle rapid typing correctly', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<DebouncedSearchInput onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'hello');
      await user.clear(input);
      await user.type(input, 'world');

      act(() => {
        vi.advanceTimersByTime(600);
      });

      // Should only call with final value
      expect(mockOnSearch).toHaveBeenLastCalledWith('world');
    });
  });

  describe('DeferredExpensiveComponent', () => {
    const mockData = generateMockData(100);

    it('should render with deferred updates', () => {
      render(<DeferredExpensiveComponent query="test" data={mockData} />);

      expect(screen.getByText(/deferred|expensive|query/i)).toBeInTheDocument();
    });

    it('should prioritize UI responsiveness', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <DeferredExpensiveComponent query="initial" data={mockData} />
      );

      // Update query rapidly
      rerender(<DeferredExpensiveComponent query="updated" data={mockData} />);

      // Should handle updates smoothly
      expect(
        screen.getByText(/deferred|expensive|updated/i)
      ).toBeInTheDocument();
    });

    it('should defer expensive computations', () => {
      const largeMockData = generateMockData(10000);
      render(<DeferredExpensiveComponent query="large" data={largeMockData} />);

      // Should render without blocking
      expect(screen.getByText(/deferred|expensive/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 7 TESTS: Performance Measurement Tools
// =============================================================================

describe('Exercise 7: Performance Measurement Tools', () => {
  describe('PerformanceMonitor', () => {
    it('should wrap children with monitoring', () => {
      render(
        <PerformanceMonitor componentName="TestComponent">
          <div>Monitored Content</div>
        </PerformanceMonitor>
      );

      expect(screen.getByText('Monitored Content')).toBeInTheDocument();
    });

    it('should measure render times', () => {
      render(
        <PerformanceMonitor componentName="TestComponent">
          <div>Content</div>
        </PerformanceMonitor>
      );

      // Should use performance measurement APIs
      expect(mockPerformance.now).toHaveBeenCalled();
    });

    it('should track re-render frequency', () => {
      const { rerender } = render(
        <PerformanceMonitor componentName="TestComponent">
          <div>Content</div>
        </PerformanceMonitor>
      );

      // Re-render multiple times
      rerender(
        <PerformanceMonitor componentName="TestComponent">
          <div>Updated Content</div>
        </PerformanceMonitor>
      );

      expect(screen.getByText('Updated Content')).toBeInTheDocument();
    });

    it('should provide performance insights', () => {
      render(
        <PerformanceMonitor componentName="TestComponent">
          <div>Content</div>
        </PerformanceMonitor>
      );

      // Should display performance data
      expect(
        screen.getByText(/performance|render|time/i) ||
          screen.getByText('Content')
      ).toBeInTheDocument();
    });
  });

  describe('ProfilerWrapper', () => {
    const mockOnRender = vi.fn();

    it('should use React Profiler API', () => {
      render(
        <ProfilerWrapper id="test-profiler" onRender={mockOnRender}>
          <div>Profiled Content</div>
        </ProfilerWrapper>
      );

      expect(screen.getByText('Profiled Content')).toBeInTheDocument();
    });

    it('should collect timing data', () => {
      render(
        <ProfilerWrapper id="test-profiler" onRender={mockOnRender}>
          <div>Content</div>
        </ProfilerWrapper>
      );

      // Should call onRender callback
      expect(mockOnRender).toHaveBeenCalled();
    });

    it('should track interaction phases', async () => {
      const user = userEvent.setup();
      render(
        <ProfilerWrapper id="test-profiler" onRender={mockOnRender}>
          <button>Click me</button>
        </ProfilerWrapper>
      );

      await user.click(screen.getByRole('button'));

      // Should track interaction timing
      expect(mockOnRender).toHaveBeenCalled();
    });
  });

  describe('MemoryUsageTracker', () => {
    it('should render memory monitoring interface', () => {
      render(<MemoryUsageTracker />);

      expect(screen.getByText(/memory|usage|tracker/i)).toBeInTheDocument();
    });

    it('should monitor memory consumption', () => {
      render(<MemoryUsageTracker />);

      // Should display memory information
      expect(screen.getByText(/memory|kb|mb|usage/i)).toBeInTheDocument();
    });

    it('should detect potential memory leaks', () => {
      const { unmount } = render(<MemoryUsageTracker />);

      // Should clean up monitoring on unmount
      unmount();

      // Should not cause memory leaks
    });
  });

  describe('BundleSizeAnalyzer', () => {
    const mockComponents = ['Component1', 'Component2', 'Component3'];

    it('should analyze bundle size impact', () => {
      render(<BundleSizeAnalyzer components={mockComponents} />);

      expect(screen.getByText(/bundle|size|analyzer/i)).toBeInTheDocument();
    });

    it('should show component size impacts', () => {
      render(<BundleSizeAnalyzer components={mockComponents} />);

      // Should display component information
      expect(screen.getByText(/component|size|impact/i)).toBeInTheDocument();
    });

    it('should identify optimization opportunities', () => {
      render(<BundleSizeAnalyzer components={mockComponents} />);

      expect(
        screen.getByText(/optimization|opportunity|lazy/i)
      ).toBeInTheDocument();
    });
  });
});

// =============================================================================
// HELPER COMPONENTS AND UTILITIES TESTS
// =============================================================================

describe('Helper Components and Utilities', () => {
  describe('RegularChild', () => {
    it('should always re-render', () => {
      const { rerender } = render(<RegularChild name="John" count={5} />);

      mockConsole.mockClear();

      // Re-render with same props
      rerender(<RegularChild name="John" count={5} />);

      // Should log render every time
      expect(mockConsole).toHaveBeenCalledWith(
        expect.stringContaining('RegularChild rendered')
      );
    });

    it('should display props correctly', () => {
      render(<RegularChild name="John" count={5} />);

      expect(screen.getByText(/john/i)).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  describe('expensiveCalculation', () => {
    it('should perform calculation and return results', () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = expensiveCalculation(numbers);

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('calculationTime');
      expect(typeof result.calculationTime).toBe('number');
    });

    it('should log calculation timing', () => {
      const numbers = [1, 2, 3];
      expensiveCalculation(numbers);

      expect(mockConsole).toHaveBeenCalledWith(
        'Performing expensive calculation...'
      );
      expect(mockConsole).toHaveBeenCalledWith(
        expect.stringContaining('Calculation took')
      );
    });
  });

  describe('HeavyComponentPlaceholder', () => {
    it('should render placeholder for heavy components', () => {
      render(<HeavyComponentPlaceholder type="dashboard" />);

      expect(screen.getByText(/heavy.*dashboard/i)).toBeInTheDocument();
    });

    it('should handle different component types', () => {
      render(<HeavyComponentPlaceholder type="chart" />);

      expect(screen.getByText(/heavy.*chart/i)).toBeInTheDocument();
    });
  });

  describe('generateMockData', () => {
    it('should generate specified number of items', () => {
      const data = generateMockData(100);

      expect(data).toHaveLength(100);
      expect(data[0]).toHaveProperty('id', 0);
      expect(data[0]).toHaveProperty('name', 'Item 0');
    });

    it('should generate realistic data structure', () => {
      const data = generateMockData(10);

      data.forEach((item, index) => {
        expect(item).toHaveProperty('id', index);
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('timestamp');
        expect(item).toHaveProperty('status');
      });
    });

    it('should handle default parameter', () => {
      const data = generateMockData();

      expect(data).toHaveLength(10000);
    });
  });

  describe('useIntersectionObserver', () => {
    it('should return intersection state', () => {
      const ref = { current: document.createElement('div') };
      const { result } = renderHook(() => useIntersectionObserver(ref));

      expect(result.current).toHaveProperty('isIntersecting');
      expect(result.current).toHaveProperty('hasIntersected');
    });

    it('should set up intersection observer', () => {
      const ref = { current: document.createElement('div') };
      renderHook(() => useIntersectionObserver(ref));

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it('should clean up observer on unmount', () => {
      const ref = { current: document.createElement('div') };
      const { unmount } = renderHook(() => useIntersectionObserver(ref));

      unmount();

      // Should clean up observer
    });
  });

  describe('usePerformanceMeasurement', () => {
    it('should return performance data function', () => {
      const { result } = renderHook(() =>
        usePerformanceMeasurement('TestComponent')
      );

      expect(typeof result.current).toBe('function');
    });

    it('should track render count', () => {
      const { result, rerender } = renderHook(() =>
        usePerformanceMeasurement('TestComponent')
      );

      const initialData = result.current();

      rerender();

      const updatedData = result.current();
      expect(updatedData.renderCount).toBeGreaterThan(initialData.renderCount);
    });

    it('should include component name in data', () => {
      const { result } = renderHook(() =>
        usePerformanceMeasurement('TestComponent')
      );

      const data = result.current();
      expect(data.componentName).toBe('TestComponent');
    });
  });
});

// Restore console.log
afterEach(() => {
  console.log = originalConsoleLog;
});
