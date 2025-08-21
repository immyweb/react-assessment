/**
 * React Performance Optimization Exercises
 *
 * This file contains exercises covering React performance optimization concepts:
 * - React.memo and memoization
 * - Component splitting strategies
 * - Bundle splitting techniques
 * - Lazy loading and Suspense
 * - Virtual list implementations
 * - Render optimization patterns
 * - Performance measurement tools
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
  lazy,
  Suspense,
  startTransition,
  useDeferredValue,
  useTransition,
  forwardRef
} from 'react';
import PropTypes from 'prop-types';

// =============================================================================
// EXERCISE 1: React.memo and Memoization
// =============================================================================

/**
 * Create a child component that should only re-render when its props change.
 * Should use React.memo to prevent unnecessary re-renders
 * Should log renders to console for demonstration
 * Parent component will have other state that shouldn't trigger child re-renders
 *
 * Expected behavior:
 * - Only re-renders when name or count props change
 * - Logs "ChildComponent rendered with: {name}, {count}" on each render
 * - Parent state changes (unrelated to props) shouldn't trigger re-renders
 */
export const MemoizedChild = memo(function ChildComponent({ name, count }) {
  // TODO: Implement memoized child component
  // Add console logging to demonstrate render behavior
});

/**
 * Create a parent component that demonstrates React.memo benefits.
 * Should have multiple state variables (childName, childCount, parentState)
 * Should render MemoizedChild and regular child for comparison
 * Should have buttons to update each state independently
 *
 * Expected behavior:
 * - childName and childCount changes should trigger MemoizedChild re-renders
 * - parentState changes should NOT trigger MemoizedChild re-renders
 * - Should demonstrate the difference with a non-memoized child
 */
export function MemoizationDemo() {
  // TODO: Implement parent component with multiple state variables
  // Include buttons to independently update each state
  // Render both memoized and non-memoized children for comparison
}

/**
 * Create a component with expensive calculations that uses useMemo.
 * Should accept an array of numbers and perform expensive operations
 * Should calculate fibonacci, prime numbers, or factorial
 * Should only recalculate when the numbers array changes
 *
 * Expected behavior:
 * - Expensive calculation should only run when numbers prop changes
 * - Should display calculation time to show optimization benefits
 * - Other prop changes should not trigger recalculation
 */
export function ExpensiveMemoCalculator({ numbers, multiplier = 1 }) {
  // TODO: Implement expensive calculation with useMemo
  // Include timing measurements to demonstrate performance benefits
}

/**
 * Create a list component that uses useCallback for event handlers.
 * Should render a list of items with click handlers
 * Should demonstrate useCallback preventing child re-renders
 * List items should be memoized components
 *
 * Expected behavior:
 * - Item click handlers should be stable references
 * - Adding new items shouldn't cause existing items to re-render
 * - Should log item renders to demonstrate optimization
 */
export function OptimizedList({ items }) {
  // TODO: Implement list with useCallback optimized handlers
  // Create memoized list item components
}

// =============================================================================
// EXERCISE 2: Component Splitting Strategies
// =============================================================================

/**
 * Create a large component that should be split into smaller components.
 * Original component handles user profile, settings, and activity feed
 * Should demonstrate how splitting improves performance and maintainability
 *
 * Split into:
 * - UserProfile component
 * - UserSettings component
 * - ActivityFeed component
 * - Main ProfilePage component that combines them
 */
export function ProfilePage({ userId }) {
  // TODO: Implement main profile page that combines split components
  // Each section should be its own component for better organization
}

/**
 * Create individual profile section components.
 * Each should be optimized and handle its own concerns
 * Should use appropriate memoization where beneficial
 */
export const UserProfile = memo(function UserProfile({ userId }) {
  // TODO: Implement user profile section
  // Fetch and display user basic information
});

export const UserSettings = memo(function UserSettings({
  userId,
  onSettingsChange
}) {
  // TODO: Implement user settings section
  // Handle settings updates independently
});

export const ActivityFeed = memo(function ActivityFeed({ userId, limit = 10 }) {
  // TODO: Implement activity feed section
  // Should be independently scrollable and loadable
});

/**
 * Create a form component split by logical sections.
 * Should split a complex form into smaller, focused components
 * Each section should manage its own state and validation
 * Should demonstrate composition and data flow patterns
 */
export function SplitFormDemo() {
  // TODO: Implement form using composed smaller components
  // PersonalInfo, ContactInfo, PreferencesInfo components
}

// =============================================================================
// EXERCISE 3: Bundle Splitting Techniques
// =============================================================================

/**
 * Create components that demonstrate dynamic imports for code splitting.
 * Should use React.lazy for components that aren't immediately needed
 * Should provide fallback loading states
 * Should handle loading errors gracefully
 */

// Heavy component that should be loaded lazily
// export const HeavyDashboard = lazy(() => import('./components/HeavyDashboard'));
// export const HeavyChart = lazy(() => import('./components/HeavyChart'));
// export const HeavyDataTable = lazy(() => import('./components/HeavyDataTable'));

/**
 * Create a component that loads heavy components on demand.
 * Should use tabs or routes to conditionally load components
 * Should provide loading states and error boundaries
 * Should demonstrate proper Suspense usage
 *
 * Expected behavior:
 * - Components should only load when their tab is selected
 * - Should show loading indicators while components load
 * - Should handle load failures gracefully
 */
export function LazyLoadingDemo() {
  // TODO: Implement lazy loading with tabs or conditional rendering
  // Use Suspense with appropriate fallbacks
  // Handle different loading states and errors
}

/**
 * Create a route-based lazy loading system.
 * Should demonstrate how to split routes for better performance
 * Should include nested lazy loading within routes
 */
export function RouteLazyLoading() {
  // TODO: Implement route-based lazy loading
  // Create mock routes that load different heavy components
}

/**
 * Create a utility for dynamic feature loading.
 * Should allow features to be loaded based on user permissions or preferences
 * Should cache loaded features to prevent re-loading
 */
export function DynamicFeatureLoader({ features, userPermissions }) {
  // TODO: Implement dynamic feature loading system
  // Load features based on permissions and cache them
}

// =============================================================================
// EXERCISE 4: Lazy Loading and Suspense
// =============================================================================

/**
 * Create a component that demonstrates various Suspense patterns.
 * Should show data fetching with Suspense
 * Should handle nested Suspense boundaries
 * Should provide meaningful loading states
 */
export function SuspensePatterns() {
  // TODO: Implement various Suspense patterns
  // Nested boundaries, data fetching, component loading
}

/**
 * Create an image lazy loading component with Suspense.
 * Should load images only when they're about to become visible
 * Should provide placeholder while loading
 * Should handle loading errors
 *
 * Expected behavior:
 * - Images load only when scrolled into view
 * - Shows placeholder/skeleton while loading
 * - Gracefully handles failed image loads
 */
export function LazyImage({ src, alt, placeholder, ...props }) {
  // TODO: Implement lazy image loading
  // Use Intersection Observer for visibility detection
  // Provide loading and error states
}

/**
 * Create a data fetching component that works with Suspense.
 * Should demonstrate how to make components Suspense-compatible
 * Should handle loading and error states properly
 * Should support refetching and cache invalidation
 */
export function SuspenseDataFetcher({ url, children }) {
  // TODO: Implement Suspense-compatible data fetcher
  // Throw promises during loading (Suspense pattern)
  // Handle errors and retries
}

/**
 * Create an infinite scroll component with lazy loading.
 * Should load more items as user scrolls
 * Should use Suspense for loading additional data
 * Should virtualize long lists for performance
 */
export function InfiniteScrollList({ fetchMore, initialItems }) {
  // TODO: Implement infinite scroll with Suspense
  // Load more data as user approaches end of list
  // Use virtualization for performance
}

// =============================================================================
// EXERCISE 5: Virtual List Implementations
// =============================================================================

/**
 * Create a basic virtual list component for large datasets.
 * Should only render visible items plus buffer
 * Should handle scrolling and maintain scroll position
 * Should work with items of fixed height
 *
 * Expected behavior:
 * - Only renders visible items (windowing)
 * - Maintains smooth scrolling experience
 * - Handles datasets of 10,000+ items efficiently
 */
export function VirtualList({
  items,
  itemHeight = 50,
  containerHeight = 400,
  renderItem,
  overscan = 5
}) {
  // TODO: Implement virtual list with windowing
  // Calculate visible range based on scroll position
  // Render only visible items plus overscan buffer
}

/**
 * Create a virtual grid component for two-dimensional data.
 * Should handle both horizontal and vertical scrolling
 * Should work with items of fixed dimensions
 * Should be optimized for large datasets
 */
export function VirtualGrid({
  items,
  itemWidth = 200,
  itemHeight = 150,
  containerWidth = 800,
  containerHeight = 600,
  columnsCount,
  renderItem
}) {
  // TODO: Implement virtual grid
  // Handle 2D virtualization for rows and columns
  // Calculate visible grid cells efficiently
}

/**
 * Create a dynamic height virtual list.
 * Should handle items with varying heights
 * Should measure items and cache measurements
 * Should maintain scroll position accurately
 *
 * Expected behavior:
 * - Supports items with different heights
 * - Measures and caches item dimensions
 * - Maintains accurate scrollbar and positioning
 */
export function DynamicVirtualList({
  items,
  estimatedItemHeight = 50,
  containerHeight = 400,
  renderItem
}) {
  // TODO: Implement dynamic height virtual list
  // Measure items as they render
  // Cache measurements for performance
  // Handle scroll position calculations
}

/**
 * Create a virtual table component with fixed headers.
 * Should virtualize rows while keeping headers visible
 * Should handle column resizing and sorting
 * Should maintain table layout and accessibility
 */
export function VirtualTable({
  data,
  columns,
  rowHeight = 40,
  headerHeight = 50,
  containerHeight = 500
}) {
  // TODO: Implement virtual table
  // Fixed header with virtualized rows
  // Handle sorting and column operations
  // Maintain table semantics and accessibility
}

// =============================================================================
// EXERCISE 6: Render Optimization Patterns
// =============================================================================

/**
 * Create a component that demonstrates render batching.
 * Should show how React batches state updates
 * Should demonstrate manual batching with startTransition
 * Should measure render performance
 */
export function RenderBatchingDemo() {
  // TODO: Implement render batching demonstration
  // Show automatic batching vs manual control
  // Include performance measurements
}

/**
 * Create a component with optimized conditional rendering.
 * Should avoid creating elements that won't be rendered
 * Should use short-circuit evaluation effectively
 * Should demonstrate early returns for performance
 */
export function ConditionalRenderOptimization({ condition, data, loading }) {
  // TODO: Implement optimized conditional rendering patterns
  // Use early returns and efficient conditionals
  // Avoid unnecessary element creation
}

/**
 * Create a component that demonstrates efficient list rendering.
 * Should use proper keys for reconciliation
 * Should avoid inline functions and objects
 * Should demonstrate list update optimization strategies
 */
export function EfficientListRendering({ items, onItemClick }) {
  // TODO: Implement efficient list rendering
  // Proper key usage for reconciliation
  // Stable references for event handlers
  // Optimized update patterns
}

/**
 * Create a debounced input component for expensive operations.
 * Should debounce user input to prevent excessive updates
 * Should use useTransition for non-urgent updates
 * Should provide visual feedback for pending states
 */
export function DebouncedSearchInput({ onSearch, placeholder = 'Search...' }) {
  // TODO: Implement debounced input with transitions
  // Debounce input to prevent excessive API calls
  // Use useTransition for smooth UX
  // Show pending states appropriately
}

/**
 * Create a component that uses useDeferredValue for expensive updates.
 * Should defer expensive calculations during user interactions
 * Should prioritize immediate UI updates over heavy computations
 * Should demonstrate smooth user experience
 */
export function DeferredExpensiveComponent({ query, data }) {
  // TODO: Implement deferred value optimization
  // Use useDeferredValue for expensive filtering/sorting
  // Prioritize UI responsiveness over computation
}

// =============================================================================
// EXERCISE 7: Performance Measurement Tools
// =============================================================================

/**
 * Create a performance monitoring component.
 * Should measure component render times
 * Should track re-render frequency
 * Should provide performance insights
 */
export function PerformanceMonitor({ children, componentName }) {
  // TODO: Implement performance monitoring
  // Measure render times using performance APIs
  // Track render frequency and optimization opportunities
  // Provide useful performance metrics
}

/**
 * Create a component that uses the React Profiler API.
 * Should wrap components to measure performance
 * Should collect timing data and interaction traces
 * Should provide performance reports
 */
export function ProfilerWrapper({ children, id, onRender }) {
  // TODO: Implement Profiler API usage
  // Collect detailed performance data
  // Report render phases and timing
}

/**
 * Create a memory usage tracker component.
 * Should monitor memory consumption
 * Should detect potential memory leaks
 * Should provide cleanup recommendations
 */
export function MemoryUsageTracker() {
  // TODO: Implement memory monitoring
  // Track memory usage patterns
  // Detect potential leaks or excessive usage
  // Provide optimization suggestions
}

/**
 * Create a bundle size analyzer component.
 * Should show component impact on bundle size
 * Should identify optimization opportunities
 * Should track lazy loading effectiveness
 */
export function BundleSizeAnalyzer({ components }) {
  // TODO: Implement bundle size analysis
  // Show component size impacts
  // Identify optimization opportunities
  // Track lazy loading benefits
}

// =============================================================================
// HELPER COMPONENTS AND UTILITIES
// =============================================================================

/**
 * Non-memoized child component for comparison testing.
 * Should always re-render when parent renders
 */
export function RegularChild({ name, count }) {
  console.log(`RegularChild rendered with: ${name}, ${count}`);

  return (
    <div style={{ padding: '10px', margin: '5px', border: '1px solid #red' }}>
      <h4>Regular Child (always re-renders)</h4>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <small>Check console for render logs</small>
    </div>
  );
}

/**
 * Heavy computation function for testing performance optimizations.
 * Simulates expensive calculation that should be memoized
 */
export function expensiveCalculation(numbers) {
  console.log('Performing expensive calculation...');
  const start = performance.now();

  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += numbers.reduce((sum, num) => sum + Math.sqrt(num * i), 0);
  }

  const end = performance.now();
  console.log(`Calculation took ${end - start} milliseconds`);

  return {
    result: result.toFixed(2),
    calculationTime: end - start
  };
}

/**
 * Simulated heavy component that would be loaded lazily.
 * Represents a component with significant bundle size
 */
export function HeavyComponentPlaceholder({ type = 'dashboard' }) {
  return (
    <div
      style={{
        padding: '20px',
        border: '2px dashed #ccc',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <div>
        <h3>Heavy {type} Component</h3>
        <p>This represents a large component that would be lazy loaded</p>
        <small>
          In real implementation, this would be in a separate bundle
        </small>
      </div>
    </div>
  );
}

/**
 * Mock data generator for testing large lists and performance.
 * Generates realistic data for virtual list testing
 */
export function generateMockData(count = 10000) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
    value: Math.floor(Math.random() * 1000),
    category: `Category ${index % 10}`,
    description: `Description for item ${index}`.repeat(
      Math.floor(Math.random() * 3) + 1
    ),
    timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)]
  }));
}

/**
 * Intersection Observer hook for lazy loading implementations.
 * Provides visibility detection for performance optimizations
 */
export function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return { isIntersecting, hasIntersected };
}

/**
 * Performance measurement hook for tracking render performance.
 * Provides timing data for optimization analysis
 */
export function usePerformanceMeasurement(componentName) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    lastRenderTime.current = performance.now();
  });

  const getPerformanceData = useCallback(
    () => ({
      renderCount: renderCount.current,
      lastRenderTime: lastRenderTime.current,
      componentName
    }),
    [componentName]
  );

  return getPerformanceData;
}
