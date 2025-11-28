/**
 * React Performance Optimization Exercises
 *
 * Simplified exercises covering fundamental performance concepts:
 * 1. Memoization (React.memo, useMemo, useCallback)
 * 2. Component Splitting
 * 3. Lazy Loading & Suspense
 * 4. Basic Virtual Lists
 *
 * Each exercise focuses on core concepts with practical examples.
 *
 * Instructions: Replace all TODO comments with your implementations.
 */

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  memo,
  lazy,
  Suspense
} from 'react';

// =============================================================================
// EXERCISE 1: Memoization Fundamentals
// =============================================================================

/**
 * Create a memoized child component that only re-renders when props change.
 *
 * Requirements:
 * - Use React.memo to prevent unnecessary re-renders
 * - Log renders to console for demonstration
 * - Accept name and count props
 * - Return JSX with name, count, and helpful text
 */
export const MemoizedChild = memo(function ChildComponent({ name, count }) {
  console.log(`MemoizedChild rendered with: ${name}, ${count}`);

  return (
    <div>
      <h4>Memoized Child</h4>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
    </div>
  );
});

/**
 * Create a parent component demonstrating React.memo benefits.
 *
 * Requirements:
 * - Multiple state variables (childName, childCount, unrelatedState)
 * - Buttons to update each state independently
 * - Render both MemoizedChild and RegularChild for comparison
 */
export function MemoizationDemo() {
  const [childName, setChildName] = useState('Alice');
  const [childCount, setChildCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(false);

  function onUpdateName(name) {
    setChildName(name);
  }

  function onUpdateCount() {
    setChildCount(childCount + 1);
  }

  function onUpdateUnrelated() {
    setUnrelatedState(!unrelatedState);
  }

  return (
    <section>
      <MemoizedChild name={childName} count={childCount} />
      <RegularChild name={childName} count={childCount} />
      <button onClick={() => onUpdateName('Bob')}>Toggle Child Name</button>
      <button onClick={onUpdateCount}>Increment Count</button>
      <button onClick={onUpdateUnrelated}>Update Unrelated State</button>
    </section>
  );
}

/**
 * Create a component demonstrating useMemo for expensive calculations.
 *
 * Requirements:
 * - Accept numbers array prop (default: [1, 2, 3, 4, 5])
 * - Perform expensive calculation only when numbers change
 * - Show calculation result and timing
 * - Include other state that doesn't trigger recalculation
 */
export function ExpensiveMemoCalculator({ numbers = [1, 2, 3, 4, 5] }) {
  const [otherState, setOtherState] = useState(false);
  const t0Ref = useRef();
  const t1Ref = useRef();

  // Expensive calculations are cached, and only re-run when
  // numbers prop changes.
  const sum = useMemo(() => {
    t0Ref.current = performance.now();
    const result = numbers.reduce((acc, num) => acc + num);
    t1Ref.current = performance.now();

    return result;
  }, [numbers]);

  return (
    <div>
      <p>Other state: {otherState}</p>
      <button onClick={() => setOtherState(!otherState)}>
        Toggle otherState
      </button>
      <p>{`Calculation time: ${
        t1Ref.current - t0Ref.current
      } milliseconds.`}</p>
      <p>{`Numbers: ${numbers.join(', ')}`}</p>
      <p>{`Result: ${sum}`}</p>
    </div>
  );
}

/**
 * Create a list with useCallback optimized event handlers.
 *
 * Requirements:
 * - Initial state with 3 items: [{ id: 1, name: 'Item 1' }, ...]
 * - Memoized list items that log renders
 * - Stable click handlers using useCallback
 * - Add/remove items functionality
 */
export function OptimizedList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);
  const [newItem, setNewItem] = useState('');

  // These functions are not recreated unnecessarily
  const clickHandler = useCallback((id) => {
    console.log(`Item ${id} clicked!`);
  }, []);

  const addItem = useCallback(() => {
    const lastItem = items.at(-1);
    setItems([...items, { id: lastItem.id + 1, name: newItem }]);
    setNewItem('');
  }, [items, newItem]);

  const removeItem = useCallback(
    (id) => {
      const filteredList = items.filter((item) => item.id !== id);
      setItems(filteredList);
    },
    [items]
  );

  return (
    <section>
      <h3>Optimized List with useCallback</h3>
      <div>
        {items.map((item) => {
          return (
            <OptimizedListItem
              key={item.id}
              item={item}
              onClick={clickHandler}
              onRemove={removeItem}
            />
          );
        })}
      </div>
      <div>
        <label htmlFor="addInput">
          Add Item
          <input
            id="addInput"
            name="addInput"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </label>
        <button onClick={addItem}>Add Item</button>
      </div>
    </section>
  );
}

// TODO: Create OptimizedListItem as a memoized component
// Requirements:
// - Accept item, onClick, onRemove props
// - Log renders to console
// - Display item name and remove button
const OptimizedListItem = memo(function ListItem({ item, onClick, onRemove }) {
  console.log(`Item id:${item.id} rendered`);

  return (
    <div>
      <div onClick={() => onClick(item.id)}>{item.name}</div>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
});

// =============================================================================
// EXERCISE 2: Component Splitting
// =============================================================================

/**
 * Create a main profile page that demonstrates component splitting.
 *
 * Requirements:
 * - Combine UserProfile, UserSettings, and ActivityFeed components
 * - Pass userId prop to all child components
 * - Use grid or flexbox layout
 */
export function UserProfilePage({ userId = 1 }) {
  return (
    <div>
      <h3>User Profile Page</h3>
      <UserProfile userId={userId} />
      <UserSettings userId={userId} />
      <ActivityFeed userId={userId} />
    </div>
  );
}

/**
 * Create a user profile component for displaying basic user information.
 *
 * Requirements:
 * - Memoized component using React.memo
 * - State for user data: { name: 'John Doe', email: 'john@example.com' }
 * - Button to update the user's name (add " Jr." suffix)
 * - Log renders with userId for performance tracking
 */
export const UserProfile = memo(function UserProfile({ userId }) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com'
  });

  console.log(`UserProfile ${userId} rendered`);

  function onUpdate() {
    setUser({
      ...user,
      name: user.name + ' Jr.'
    });
  }

  return (
    <div>
      <h3>Profile Information</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={onUpdate}>Update Name</button>
    </div>
  );
});

/**
 * Create a user settings component for managing user preferences.
 *
 * Requirements:
 * - Memoized component using React.memo
 * - State for notifications (boolean, default: true)
 * - State for theme (string, default: 'light')
 * - Checkbox for notifications and select for theme
 * - Log renders with userId for performance tracking
 */
export const UserSettings = memo(function UserSettings({ userId }) {
  const [notification, setNotification] = useState(true);
  const [theme, setTheme] = useState('light');

  console.log(`UserSettings ${userId} rendered`);

  return (
    <div>
      <h3>Settings</h3>
      <label htmlFor="notification">
        Enable Notifications{' '}
        <input
          id="notification"
          name="notification"
          type="checkbox"
          checked={notification}
          onChange={() => setNotification(!notification)}
        />
      </label>
      <label htmlFor="theme">
        Theme{' '}
        <select
          id="theme"
          name="theme"
          defaultValue={theme}
          onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
});

/**
 * Create an activity feed component showing user's recent activities.
 *
 * Requirements:
 * - Memoized component using React.memo
 * - Static activities array: ['Logged in', 'Updated profile', 'Changed password', 'Posted a comment', 'Liked a post']
 * - Support limit prop (default: 5) to control number of activities shown
 * - Log renders with userId for performance tracking
 */
export const ActivityFeed = memo(function ActivityFeed({ userId, limit = 5 }) {
  const [activities, setActivities] = useState([
    'Logged in',
    'Updated profile',
    'Changed password',
    'Posted a comment',
    'Liked a post'
  ]);

  console.log(`ActivityFeed ${userId} rendered`);

  const limitedActivities = activities.slice(0, limit);

  return (
    <div>
      <h3>Recent Activity</h3>
      <ul>
        {limitedActivities.map((activity, i) => {
          return <li key={i}>{activity}</li>;
        })}
      </ul>
    </div>
  );
});

// =============================================================================
// EXERCISE 3: Lazy Loading & Suspense
// =============================================================================

/**
 * Create lazy-loaded components using React.lazy.
 *
 * Requirements:
 * - Create HeavyDashboard that loads after 1 second delay
 * - Create HeavyReports that loads after 1.5 second delay
 * - Components should return JSX with titles and mock content
 * - Use Promise with setTimeout to simulate loading delay
 */

// TODO: Create HeavyDashboard using React.lazy
// Should return a Promise that resolves after 1000ms with a component showing:
// - "Heavy Dashboard Component" title
// - Text about lazy loading
// - Mock chart placeholders (2 divs with "Chart 1" and "Chart 2")
const HeavyDashboard = lazy(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div>
            <h3>Heavy Dashboard Component</h3>
            <p>This component is lazy loaded</p>
            <div>Chart 1</div>
            <div>Chart 2</div>
          </div>
        )
      });
    }, 1000);
  });
});

// TODO: Create HeavyReports using React.lazy
// Should return a Promise that resolves after 1500ms with a component showing:
// - "Heavy Reports Component" title
// - Text about lazy loading
// - Mock table with headers "Metric" and "Value" and sample rows
const HeavyReports = lazy(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div>
            <h3>Heavy Reports Component</h3>
            <p>This component is lazy loaded</p>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1000</td>
                  <td>1212</td>
                </tr>
                <tr>
                  <td>56443</td>
                  <td>940389</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      });
    }, 1500);
  });
});

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

/**
 * Create a component demonstrating lazy loading with tabs.
 *
 * Requirements:
 * - State for activeTab with options: 'home', 'dashboard', 'reports'
 * - Tab buttons for each option with proper styling
 * - Show different content based on active tab
 * - Use Suspense with loading fallbacks for lazy components
 * - Include helpful text about lazy loading behavior
 */
export function LazyLoadingDemo() {
  const [activeTab, setActiveTab] = useState('home');

  function onTabClick(tab) {
    setActiveTab(tab);
  }

  // TODO: Return JSX with:
  // - Tab buttons (styled to show active state)
  // - Conditional content based on activeTab
  // - Suspense boundaries for lazy components with loading fallbacks
  // - Information text about lazy loading
  return (
    <div>
      <ul>
        <li>
          <button
            onClick={() => onTabClick('home')}
            style={
              activeTab === 'home' ? { color: 'red' } : { color: 'black' }
            }>
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => onTabClick('dashboard')}
            style={
              activeTab === 'dashboard' ? { color: 'red' } : { color: 'black' }
            }>
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => onTabClick('reports')}
            style={
              activeTab === 'reports' ? { color: 'red' } : { color: 'black' }
            }>
            Reports
          </button>
        </li>
      </ul>
      <section>
        <h3>Lazy Loading Demo</h3>
        <p>Dashboard and Reports are lazy loaded in</p>
        {activeTab === 'home' && <div>Welcome Home!</div>}
        {activeTab === 'dashboard' && (
          <Suspense fallback={<Loading />}>
            <HeavyDashboard />
          </Suspense>
        )}
        {activeTab === 'reports' && (
          <Suspense fallback={<Loading />}>
            <HeavyReports />
          </Suspense>
        )}
      </section>
    </div>
  );
}

// =============================================================================
// EXERCISE 4: Basic Virtual List
// =============================================================================

/**
 * Create a basic virtual list for handling large datasets efficiently.
 *
 * Requirements:
 * - Props: items, itemHeight (default: 50), containerHeight (default: 400), overscan (default: 3)
 * - State for scrollTop position
 * - Calculate visible range based on scroll position
 * - Only render visible items plus overscan buffer
 * - Handle scroll events to update scrollTop
 * - Show total height for proper scrollbar
 * - Display performance info (visible count, total count, scroll position, visible range)
 */
export function VirtualList({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  overscan = 3
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) - 1
  );

  const totalHeight = items.length * itemHeight;

  const visibleItems = items.slice(startIndex, endIndex + 1);

  function onScrollHandler(scroll) {
    setScrollTop(scroll);
  }

  // TODO: Return JSX with:
  // - Title and performance info
  // - Scrollable container with total height
  // - Positioned visible items using VirtualListItem
  // - Debug info showing scroll position and visible range
  return (
    <div
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={(e) => onScrollHandler(e.target.scrollTop)}>
      <h2>Virtual List Demo</h2>
      <p>{`Scroll position: ${scrollTop}`}</p>
      <p>{`Visible range: ${startIndex} to ${endIndex}`}</p>
      <p>{`Visible count: ${visibleItems.length}`}</p>
      <p>{`Total count: ${items.length}`}</p>
      <p>{`Showing ${visibleItems.length} of ${items.length} items`}</p>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          return (
            <VirtualListItem
              key={item.id}
              item={item}
              height={itemHeight}
              index={startIndex + index}
            />
          );
        })}
      </div>
    </div>
  );
}

// TODO: Create VirtualListItem as a memoized component
// Requirements:
// - Props: item, height, index
// - Fixed height styling
// - Display item index, name, and value
// - Alternating background colors for odd/even rows
const VirtualListItem = memo(function VirtualListItem({ item, height, index }) {
  // TODO: Return JSX with proper styling and item data
  return (
    <div
      style={{
        position: 'absolute',
        top: index * height,
        height: `${height}px`,
        width: '100%',
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e0e0e0'
      }}>
      <p>{`Item name: ${item.name}`}</p>
      <p>{`Item index: ${index}`}</p>
      <p>{`Item value: ${item.value}`}</p>
    </div>
  );
});

// =============================================================================
// HELPER COMPONENTS AND UTILITIES
// =============================================================================

/**
 * Non-memoized child component for comparison with MemoizedChild.
 * Always re-renders when parent renders.
 */
export function RegularChild({ name, count }) {
  console.log(`RegularChild rendered with: ${name}, ${count}`);

  return (
    <div style={{ padding: '10px', margin: '5px', border: '1px solid red' }}>
      <h4>Regular Child (always re-renders)</h4>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <small>Check console for render logs</small>
    </div>
  );
}

/**
 * Generate mock data for testing virtual lists and performance.
 */
export function generateMockData(count = 10000) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
    value: Math.floor(Math.random() * 1000),
    category: `Category ${index % 10}`,
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)]
  }));
}

/**
 * Demo component that shows all exercises together.
 * Students can implement this after completing individual exercises.
 */
export function PerformanceExercisesDemo() {
  // TODO: Generate mock data for virtual list

  // TODO: Return JSX that renders all exercise components with proper spacing
  // Include: MemoizationDemo, ExpensiveMemoCalculator, OptimizedList,
  // UserProfilePage, LazyLoadingDemo, VirtualList
  // Add CSS for spinner animation
  return <div>TODO: Implement PerformanceExercisesDemo</div>;
}
