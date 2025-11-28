/**
 * Code Quality:
 *
 * 1. Unclear variable/function names
 * 2. Repeated code that should be extracted
 * 3. Magic numbers or strings (should be constants)
 * 4. Overly complex components (doing too much)
 */

import React, { useState, useEffect } from 'react';

// =============================================================================
// 1. Unclear variable/function names
// =============================================================================

// ❌ Bad - Unclear, abbreviated, or misleading names:
function UserProfile() {
  const [d, setD] = useState(null); // ❌ What is 'd'?
  const [flg, setFlg] = useState(false); // ❌ What flag?
  const [arr, setArr] = useState([]); // ❌ Array of what?
  const [temp, setTemp] = useState(''); // ❌ Temporary what?

  const fn = () => {
    // ❌ What does this function do?
    setFlg(true);
  };

  const handle = (x) => {
    // ❌ Handle what? What is x?
    setArr([...arr, x]);
  };

  const calc = (a, b) => {
    // ❌ Calculate what?
    return a * b * 0.9;
  };

  return (
    <div>
      {d && <h1>{d.n}</h1>} {/* ❌ What is 'n'? */}
      <button onClick={fn}>Click</button>
    </div>
  );
}

// ✅ Good - Clear, descriptive names:
function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const showLoadingIndicator = () => {
    setIsLoading(true);
  };

  const addPurchaseToHistory = (purchase) => {
    setPurchaseHistory([...purchaseHistory, purchase]);
  };

  const calculateDiscountedPrice = (originalPrice, quantity) => {
    const BULK_DISCOUNT_RATE = 0.9;
    return originalPrice * quantity * BULK_DISCOUNT_RATE;
  };

  return (
    <div>
      {userData && <h1>{userData.fullName}</h1>}
      <button onClick={showLoadingIndicator}>Load Data</button>
    </div>
  );
}

// Boolean names:
// ❌ Bad - Unclear boolean names
const data = true; // ❌ What data?
const flag = false; // ❌ What flag?
const check = true; // ❌ Check what?
const status = false; // ❌ Status of what?

// ✅ Good - Clear boolean names (use is/has/should/can)
const isDataLoaded = true;
const hasUserPermission = false;
const shouldShowModal = true;
const canEditPost = false;
const isFormValid = true;
const hasErrors = false;

// =============================================================================
// 2. Repeated Code That Should Be Extracted
// =============================================================================

// ❌ Bad - Repeated logic:
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // ❌ Repeated fetch pattern
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  useEffect(() => {
    // ❌ Same code repeated
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  useEffect(() => {
    // ❌ Same code repeated again
    fetch('/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  return <div>{/* ... */}</div>;
}

// ✅ Good - Extracted into reusable function:
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // ✅ Reusable fetch function
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${endpoint}`);
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData('/api/users', setUsers);
    fetchData('/api/products', setProducts);
    fetchData('/api/orders', setOrders);
  }, []);

  return <div>{/* ... */}</div>;
}

// Another example - Repeated JSX:
// ❌ Bad - Repeated card structure
function ProductGrid({ products }) {
  const featured = products.filter((p) => p.featured);
  const onSale = products.filter((p) => p.onSale);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div>
      <h2>Featured</h2>
      <div className="grid">
        {featured.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>On Sale</h2>
      <div className="grid">
        {/* ❌ Exact same structure repeated */}
        {onSale.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>New Arrivals</h2>
      <div className="grid">
        {/* ❌ Repeated again */}
        {newArrivals.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Good - Extract into component
function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

function ProductSection({ title, products }) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductGrid({ products }) {
  const featured = products.filter((p) => p.featured);
  const onSale = products.filter((p) => p.onSale);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div>
      <ProductSection title="Featured" products={featured} />
      <ProductSection title="On Sale" products={onSale} />
      <ProductSection title="New Arrivals" products={newArrivals} />
    </div>
  );
}

// Repeated validation logic:

// ❌ Bad - Validation repeated
function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // ❌ Repeated validation pattern
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    }

    if (formData.email.length < 5) {
      newErrors.email = 'Email must be at least 5 characters';
    }
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email must contain @';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password.length > 50) {
      newErrors.password = 'Password must be less than 50 characters';
    }

    setErrors(newErrors);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}

// ✅ Good - Extract validation logic
const validators = {
  username: (value) => {
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 20) return 'Username must be less than 20 characters';
    return null;
  },
  email: (value) => {
    if (value.length < 5) return 'Email must be at least 5 characters';
    if (!value.includes('@')) return 'Email must contain @';
    return null;
  },
  password: (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (value.length > 50) return 'Password must be less than 50 characters';
    return null;
  }
};

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const error = validators[field](data[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}

// =============================================================================
// 3. Magic Numbers or Strings (Should be Constants)
// =============================================================================

// ❌ Bad - Magic numbers and strings:
function PricingCalculator({ basePrice, quantity }) {
  // ❌ What is 0.2? What is 0.15? What is 100?
  const discount = quantity > 100 ? 0.2 : 0.15;
  const discountedPrice = basePrice * (1 - discount);

  // ❌ What is 0.08? Why 0.08?
  const tax = discountedPrice * 0.08;

  // ❌ What is 5.99? Why this number?
  const shipping = discountedPrice > 50 ? 0 : 5.99;

  const total = discountedPrice + tax + shipping;

  return (
    <div>
      <p>Subtotal: ${discountedPrice.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <p>Shipping: ${shipping.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}

function UserStatus({ user }) {
  // ❌ Magic strings
  if (user.role === 'admin') {
    return <div>Admin Access</div>;
  }
  if (user.status === 'active' && user.level > 5) {
    return <div>Premium User</div>;
  }
  return <div>Standard User</div>;
}

// ✅ Good - Named constants:
// ✅ Constants with clear names explaining their purpose
const PRICING_CONFIG = {
  BULK_DISCOUNT_THRESHOLD: 100,
  BULK_DISCOUNT_RATE: 0.2,
  STANDARD_DISCOUNT_RATE: 0.15,
  TAX_RATE: 0.08,
  FREE_SHIPPING_THRESHOLD: 50,
  STANDARD_SHIPPING_COST: 5.99
};

function PricingCalculator({ basePrice, quantity }) {
  const discount =
    quantity > PRICING_CONFIG.BULK_DISCOUNT_THRESHOLD
      ? PRICING_CONFIG.BULK_DISCOUNT_RATE
      : PRICING_CONFIG.STANDARD_DISCOUNT_RATE;

  const discountedPrice = basePrice * (1 - discount);
  const tax = discountedPrice * PRICING_CONFIG.TAX_RATE;

  const shipping =
    discountedPrice > PRICING_CONFIG.FREE_SHIPPING_THRESHOLD
      ? 0
      : PRICING_CONFIG.STANDARD_SHIPPING_COST;

  const total = discountedPrice + tax + shipping;

  return (
    <div>
      <p>Subtotal: ${discountedPrice.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <p>Shipping: ${shipping.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}

// ✅ Constants for magic strings
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

const PREMIUM_USER_LEVEL_THRESHOLD = 5;

function UserStatus({ user }) {
  if (user.role === USER_ROLES.ADMIN) {
    return <div>Admin Access</div>;
  }

  if (
    user.status === USER_STATUS.ACTIVE &&
    user.level > PREMIUM_USER_LEVEL_THRESHOLD
  ) {
    return <div>Premium User</div>;
  }

  return <div>Standard User</div>;
}

// API endpoints and status codes:

// ❌ Bad - Magic strings for endpoints
function DataManager() {
  const fetchUsers = () => fetch('/api/v1/users');
  const fetchPosts = () => fetch('/api/v1/posts');
  const fetchComments = () => fetch('/api/v1/comments');

  const handleResponse = (response) => {
    if (response.status === 200) return response.json();
    if (response.status === 404) throw new Error('Not found');
    if (response.status === 500) throw new Error('Server error');
  };
}

// ✅ Good - Constants for endpoints and status codes
const API_ENDPOINTS = {
  USERS: '/api/v1/users',
  POSTS: '/api/v1/posts',
  COMMENTS: '/api/v1/comments'
};

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

function DataManager() {
  const fetchUsers = () => fetch(API_ENDPOINTS.USERS);
  const fetchPosts = () => fetch(API_ENDPOINTS.POSTS);
  const fetchComments = () => fetch(API_ENDPOINTS.COMMENTS);

  const handleResponse = (response) => {
    if (response.status === HTTP_STATUS.OK) return response.json();
    if (response.status === HTTP_STATUS.NOT_FOUND) {
      throw new Error('Not found');
    }
    if (response.status === HTTP_STATUS.SERVER_ERROR) {
      throw new Error('Server error');
    }
  };
}

// =============================================================================
// 4. Overly Complex Components (Doing Too Much)
// =============================================================================

// ❌ Bad - God component doing everything:

function UserDashboard() {
  // ❌ Too many responsibilities in one component
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [friends, setFriends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  // ❌ Fetching multiple data sources
  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then(setUser);
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts);
    fetch('/api/comments')
      .then((res) => res.json())
      .then(setComments);
    fetch('/api/friends')
      .then((res) => res.json())
      .then(setFriends);
    fetch('/api/notifications')
      .then((res) => res.json())
      .then(setNotifications);
    fetch('/api/settings')
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  // ❌ Complex filtering and sorting logic
  const filteredPosts = posts
    .filter((post) => {
      if (filter === 'all') return true;
      if (filter === 'mine') return post.userId === user?.id;
      if (filter === 'friends')
        return friends.some((f) => f.id === post.userId);
      return true;
    })
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'likes') return b.likes - a.likes;
      if (sortBy === 'comments') return b.commentCount - a.commentCount;
      return 0;
    });

  // ❌ Multiple event handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditFormData({
      name: user.name,
      email: user.email,
      bio: user.bio
    });
  };

  const handleSaveProfile = async () => {
    await fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify(editFormData)
    });
    setUser({ ...user, ...editFormData });
    setIsEditingProfile(false);
  };

  const handleAddComment = async (postId) => {
    const comment = {
      postId,
      text: newComment,
      userId: user.id
    };
    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify(comment)
    });
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleLikePost = async (postId) => {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleDeletePost = async (postId) => {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleUpdateSettings = async (newSettings) => {
    await fetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(newSettings)
    });
    setSettings(newSettings);
  };

  // ❌ Massive JSX with everything inline
  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <div className="notifications">
          {notifications.map((n) => (
            <div key={n.id} className="notification">
              {n.message}
            </div>
          ))}
        </div>
      </header>

      <div className="profile-section">
        {isEditingProfile ? (
          <div className="edit-form">
            <input
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
            />
            <input
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
            />
            <textarea
              value={editFormData.bio}
              onChange={(e) =>
                setEditFormData({ ...editFormData, bio: e.target.value })
              }
            />
            <button onClick={handleSaveProfile}>Save</button>
            <button onClick={() => setIsEditingProfile(false)}>Cancel</button>
          </div>
        ) : (
          <div className="profile">
            <img src={user?.avatar} alt={user?.name} />
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <p>{user?.bio}</p>
            <button onClick={handleEditProfile}>Edit Profile</button>
          </div>
        )}
      </div>

      <div className="filters">
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Posts</option>
          <option value="mine">My Posts</option>
          <option value="friends">Friends' Posts</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="likes">Sort by Likes</option>
          <option value="comments">Sort by Comments</option>
        </select>
      </div>

      <div className="posts">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="post-actions">
              <button onClick={() => handleLikePost(post.id)}>
                Like ({post.likes})
              </button>
              <button
                onClick={() => {
                  setSelectedPost(post.id);
                  setShowComments(!showComments);
                }}>
                Comments ({post.commentCount})
              </button>
              {post.userId === user?.id && (
                <button onClick={() => handleDeletePost(post.id)}>
                  Delete
                </button>
              )}
            </div>

            {showComments && selectedPost === post.id && (
              <div className="comments">
                {comments
                  .filter((c) => c.postId === post.id)
                  .map((comment) => (
                    <div key={comment.id} className="comment">
                      {comment.text}
                    </div>
                  ))}
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={() => handleAddComment(post.id)}>
                  Post Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar">
        <div className="friends-list">
          <h3>Friends</h3>
          {friends.map((friend) => (
            <div key={friend.id} className="friend">
              <img src={friend.avatar} alt={friend.name} />
              <span>{friend.name}</span>
            </div>
          ))}
        </div>

        <div className="settings">
          <h3>Settings</h3>
          <label>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                handleUpdateSettings({
                  ...settings,
                  emailNotifications: e.target.checked
                })
              }
            />
            Email Notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.privateProfile}
              onChange={(e) =>
                handleUpdateSettings({
                  ...settings,
                  privateProfile: e.target.checked
                })
              }
            />
            Private Profile
          </label>
        </div>
      </div>
    </div>
  );
}

// ✅ Good - Split into focused components:

// ✅ Separate component for profile
function UserProfile({ user, onEdit }) {
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  );
}

// ✅ Separate component for profile editing
function ProfileEditor({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="edit-form">
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <textarea
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

// ✅ Separate component for post filters
function PostFilters({
  filter,
  sortBy,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange
}) {
  return (
    <div className="filters">
      <input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
        <option value="all">All Posts</option>
        <option value="mine">My Posts</option>
        <option value="friends">Friends' Posts</option>
      </select>
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="date">Sort by Date</option>
        <option value="likes">Sort by Likes</option>
        <option value="comments">Sort by Comments</option>
      </select>
    </div>
  );
}
