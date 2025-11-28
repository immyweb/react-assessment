/**
 * Data Fetching:
 *
 * 1. Fetching in wrong place (not in useEffect)
 * 2. No cleanup in useEffect
 * 3. No loading states
 * 4. No error handling
 * 5. Race conditions (multiple fetches)
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// 1. Fetching in wrong place (not in useEffect)
// =============================================================================

// ❌ Bad - Fetching during render:

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // ❌ WRONG: Fetching directly in component body
  // This runs on EVERY render, causing infinite loops!
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setUser(data); // This causes re-render, which triggers fetch again!
    });

  return <div>{user?.name}</div>;
}

// ❌ Bad - Fetching in event handler that should use useEffect:

function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  // ❌ WRONG: Should fetch when category changes, not on button click
  const loadProducts = () => {
    fetch(`/api/products?category=${category}`)
      .then((res) => res.json())
      .then(setProducts);
  };

  // ❌ User has to manually click to load data
  return (
    <div>
      <button onClick={loadProducts}>Load Products</button>
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}

// ✅ Good - Fetching in useEffect:

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Fetch in useEffect - runs once per userId change
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]); // Re-fetch when userId changes

  return <div>{user?.name}</div>;
}

function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ✅ Automatically fetch when component mounts or category changes
    fetch(`/api/products?category=${category}`)
      .then((res) => res.json())
      .then(setProducts);
  }, [category]);

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}

// Another example - Conditional fetching:

// ❌ Bad - Conditional fetch outside useEffect
function Dashboard({ isAuthenticated, userId }) {
  const [data, setData] = useState(null);

  // ❌ WRONG: Runs every render
  if (isAuthenticated) {
    fetch(`/api/dashboard/${userId}`)
      .then((res) => res.json())
      .then(setData);
  }

  return <div>{data?.summary}</div>;
}

// ✅ Good - Conditional fetch inside useEffect
function Dashboard({ isAuthenticated, userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetch(`/api/dashboard/${userId}`)
        .then((res) => res.json())
        .then(setData);
    }
  }, [isAuthenticated, userId]);

  return <div>{data?.summary}</div>;
}

// =============================================================================
// 2. No Cleanup in useEffect
// =============================================================================

// ❌ Bad - No cleanup for async operations:

function UserSearch({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // ❌ No cleanup - can cause memory leaks and race conditions
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data));
    // Component might unmount before fetch completes
    // Trying to update state on unmounted component causes error
  }, [query]);

  return (
    <div>
      {results.map((r) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
}

// ❌ Bad - No cleanup for intervals/timers:

function LivePrice({ stockSymbol }) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // ❌ No cleanup - interval keeps running after unmount
    const interval = setInterval(() => {
      fetch(`/api/price/${stockSymbol}`)
        .then((res) => res.json())
        .then((data) => setPrice(data.price));
    }, 5000);

    // Missing: return () => clearInterval(interval);
  }, [stockSymbol]);

  return <div>Price: ${price}</div>;
}

// ✅ Good - Proper cleanup with abort controller:

function UserSearch({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // ✅ Use AbortController to cancel requests
    const abortController = new AbortController();

    fetch(`/api/search?q=${query}`, {
      signal: abortController.signal
    })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        }
      });

    // ✅ Cleanup function cancels the fetch
    return () => {
      abortController.abort();
    };
  }, [query]);

  return (
    <div>
      {results.map((r) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
}

// ✅ Good - Cleanup with flag for older browsers:

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Use flag to ignore stale responses
    let isCancelled = false;

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          setUser(data);
        }
      });

    // ✅ Cleanup function sets flag
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ✅ Good - Cleanup for intervals:

function LivePrice({ stockSymbol }) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchPrice = () => {
      fetch(`/api/price/${stockSymbol}`)
        .then((res) => res.json())
        .then((data) => setPrice(data.price));
    };

    // Initial fetch
    fetchPrice();

    // Set up interval
    const interval = setInterval(fetchPrice, 5000);

    // ✅ Cleanup function clears interval
    return () => {
      clearInterval(interval);
    };
  }, [stockSymbol]);

  return <div>Price: ${price}</div>;
}

// Another example - WebSocket cleanup:

// ❌ Bad - No cleanup for WebSocket
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://chat.com/${roomId}`);

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // ❌ Missing cleanup - socket stays open after unmount
  }, [roomId]);

  return <div>{/* ... */}</div>;
}

// ✅ Good - Cleanup WebSocket
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://chat.com/${roomId}`);

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // ✅ Cleanup function closes socket
    return () => {
      socket.close();
    };
  }, [roomId]);

  return <div>{/* ... */}</div>;
}

// =============================================================================
// 3. No Loading States
// =============================================================================

// ❌ Bad - No loading indicator:

function ArticleList() {
  const [articles, setArticles] = useState([]);
  // ❌ No loading state

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then(setArticles);
  }, []);

  // ❌ Shows empty list while loading - bad UX
  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}

// ❌ Bad - Loading state but poorly implemented:

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        // ❌ Forgot to set loading to false
      });
  }, [productId]);

  // ❌ Loading never becomes false - stuck forever
  if (loading) return <div>Loading...</div>;

  return <div>{product?.name}</div>;
}

// ✅ Good - Proper loading state:

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="spinner">Loading articles...</div>;
  }

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}

// ✅ Good - Loading state with async/await:

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        // ✅ Always set loading to false
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}

// Multiple loading states:

// ❌ Bad - No granular loading states
function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ❌ Everything waits for everything else
    Promise.all([
      fetch('/api/user').then((r) => r.json()),
      fetch('/api/posts').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json())
    ]).then(([userData, postsData, statsData]) => {
      setUser(userData);
      setPosts(postsData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{/* ... */}</div>;
}

// ✅ Good - Independent loading states
function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // ✅ Each fetch is independent
    fetch('/api/user')
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setLoadingUser(false);
      });

    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoadingPosts(false);
      });

    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoadingStats(false);
      });
  }, []);

  return (
    <div>
      <div>{loadingUser ? <Spinner /> : <UserProfile user={user} />}</div>
      <div>{loadingPosts ? <Spinner /> : <PostList posts={posts} />}</div>
      <div>{loadingStats ? <Spinner /> : <StatsPanel stats={stats} />}</div>
    </div>
  );
}

// =============================================================================
// 4. No Error Handling
// =============================================================================

// ❌ Bad - No error handling:

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // ❌ No error handling - app crashes on network error
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// ❌ Bad - Partial error handling:

function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json()) // ❌ Doesn't check if response is ok
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err); // ❌ Just logs error, no user feedback
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div>Loading...</div>;

  // ❌ Could be null due to error, but no error message shown
  return <div>{product?.name}</div>;
}

// ✅ Good - Comprehensive error handling:

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/users');

        // ✅ Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        // ✅ Capture error for user feedback
        setError(err.message);
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// ✅ Good - Different error types:

function DataFetcher({ endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(endpoint);

        // ✅ Handle different HTTP errors differently
        if (response.status === 404) {
          throw new Error('Resource not found');
        }

        if (response.status === 401) {
          throw new Error('Unauthorized - please log in');
        }

        if (response.status === 500) {
          throw new Error('Server error - please try again later');
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name === 'TypeError') {
          // Network error
          setError('Network error - check your connection');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>No data available</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// =============================================================================
// 5. Race Conditions (Multiple Fetches)
// =============================================================================

// ❌ Bad - Race condition with fast typing:

function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // ❌ No race condition handling
    // If user types "react", then quickly types "vue",
    // results for "react" might arrive AFTER "vue" and overwrite them
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data));
  }, [query]);

  return (
    <div>
      {results.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  );
}

// ❌ Bad - Race condition with tab switching:

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ❌ If userId changes rapidly (user clicking through tabs),
    // responses might arrive out of order
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ✅ Good - Using cleanup flag:

function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ Only update if this effect hasn't been cleaned up
        if (!isCancelled) {
          setResults(data);
        }
      });

    return () => {
      // ✅ Mark this fetch as stale
      isCancelled = true;
    };
  }, [query]);

  return (
    <div>
      {results.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  );
}

// ✅ Good - Using AbortController:

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}`, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        // ✅ Don't set error if request was aborted
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // ✅ Cancel fetch if userId changes
    return () => {
      abortController.abort();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{user?.name}</div>;
}

// Complex race condition example:

// ❌ Bad - Multiple interdependent fetches with race conditions
function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // ❌ Fetch order
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((orderData) => {
        setOrder(orderData);

        // ❌ Fetch customer based on order
        // Race condition: if orderId changes, both fetches should cancel
        fetch(`/api/customers/${orderData.customerId}`)
          .then((res) => res.json())
          .then(setCustomer);

        // ❌ Fetch items based on order
        fetch(`/api/items?orderId=${orderId}`)
          .then((res) => res.json())
          .then(setItems);
      });
  }, [orderId]);

  return <div>{/* ... */}</div>;
}

// ✅ Good - Proper cleanup for dependent fetches
function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch order
        const orderResponse = await fetch(`/api/orders/${orderId}`);
        if (!orderResponse.ok) throw new Error('Failed to fetch order');
        const orderData = await orderResponse.json();

        if (isCancelled) return;
        setOrder(orderData);

        // Fetch customer and items in parallel
        const [customerResponse, itemsResponse] = await Promise.all([
          fetch(`/api/customers/${orderData.customerId}`),
          fetch(`/api/items?orderId=${orderId}`)
        ]);

        if (!customerResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch order details');
        }

        const [customerData, itemsData] = await Promise.all([
          customerResponse.json(),
          itemsResponse.json()
        ]);

        // ✅ Only update if not cancelled
        if (!isCancelled) {
          setCustomer(customerData);
          setItems(itemsData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();

    return () => {
      isCancelled = true;
    };
  }, [orderId]);

  if (loading) return <div>Loading order...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Order #{order?.id}</h2>
      <p>Customer: {customer?.name}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
