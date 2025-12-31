/**
 * React Security Practices Exercises
 *
 * This file contains exercises covering security concepts in React:
 * - XSS (Cross-Site Scripting) prevention techniques
 * - Safe usage of dangerouslySetInnerHTML
 * - Input sanitization strategies
 * - CSRF protection in forms
 * - Content Security Policy integration
 * - Secure data handling
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

// =============================================================================
// EXERCISE 1: XSS Prevention - Safe User Content Display
// =============================================================================

/**
 * Create a component that safely displays user-generated content.
 * Should prevent XSS attacks by properly escaping user input.
 * Should NOT use dangerouslySetInnerHTML for user input.
 *
 * Requirements:
 * - Accept username and bio as props
 * - Display both fields safely
 * - Automatically escape any HTML/script tags in the content
 * - Should render as plain text, not as HTML
 *
 * Example:
 * Input: username="<script>alert('xss')</script>John"
 * Should display: "<script>alert('xss')</script>John" (as visible text)
 * Should NOT execute the script
 *
 * Expected structure:
 * <div className="user-profile">
 *   <h2>{username}</h2>
 *   <p>{bio}</p>
 * </div>
 */
export function SafeUserProfile({ username, bio }) {
  // TODO: Implement safe user profile display
  // Hint: React automatically escapes content in JSX expressions
}

SafeUserProfile.propTypes = {
  username: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired
};

// =============================================================================
// EXERCISE 2: Safe HTML Rendering with Sanitization
// =============================================================================

/**
 * Create a component that safely renders HTML content from a trusted source.
 * Should use DOMPurify or similar library to sanitize HTML before rendering.
 *
 * Requirements:
 * - Accept htmlContent prop (string containing HTML)
 * - Sanitize the HTML to remove dangerous elements/attributes
 * - Remove script tags, event handlers, and dangerous protocols
 * - Safely render the sanitized HTML using dangerouslySetInnerHTML
 *
 * Dangerous content to remove:
 * - <script> tags
 * - Event handlers (onclick, onerror, etc.)
 * - javascript: protocol in href/src
 * - <iframe> tags
 * - <object> and <embed> tags
 *
 * Install: npm install dompurify
 * For tests: npm install isomorphic-dompurify
 *
 * Example usage:
 * <SanitizedHTML htmlContent="<p>Safe content</p><script>alert('xss')</script>" />
 * Should render: <p>Safe content</p> (script removed)
 */
export function SanitizedHTML({ htmlContent }) {
  // TODO: Implement sanitized HTML rendering
  // 1. Import DOMPurify
  // 2. Sanitize the htmlContent
  // 3. Render using dangerouslySetInnerHTML with sanitized content

  return null;
}

SanitizedHTML.propTypes = {
  htmlContent: PropTypes.string.isRequired
};

// =============================================================================
// EXERCISE 3: Safe Link Rendering
// =============================================================================

/**
 * Create a component that safely renders user-provided URLs.
 * Should prevent javascript: protocol and other dangerous URL schemes.
 *
 * Requirements:
 * - Accept url and text props
 * - Validate URL to ensure it uses safe protocols (http/https/mailto)
 * - Prevent javascript:, data:, vbscript: protocols
 * - Add rel="noopener noreferrer" for external links
 * - Render a safe link or fallback to plain text
 *
 * Safe protocols: http, https, mailto
 * Dangerous protocols: javascript, data, vbscript, file
 *
 * Expected behavior:
 * - Safe URL: Render as link
 * - Dangerous URL: Render as plain text with warning
 * - Invalid URL: Render as plain text
 */
export function SafeLink({ url, text, external = true }) {
  // TODO: Implement safe link rendering
  // 1. Validate URL protocol
  // 2. If safe, render as <a> with appropriate attributes
  // 3. If unsafe, render as <span> with the text

  return null;
}

SafeLink.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  external: PropTypes.bool
};

// =============================================================================
// EXERCISE 4: CSRF-Protected Form
// =============================================================================

/**
 * Create a form component with CSRF protection.
 * Should include a CSRF token in form submissions.
 *
 * Requirements:
 * - Accept csrfToken prop
 * - Include hidden input with CSRF token
 * - Form should have method="post" and action
 * - Include email and message fields
 * - Prevent submission if CSRF token is missing
 *
 * CSRF Token should:
 * - Be included as a hidden input field
 * - Have name="csrf_token" or "csrfToken"
 * - Be sent with every form submission
 *
 * Expected structure:
 * <form method="post" action="/api/submit">
 *   <input type="hidden" name="csrf_token" value={csrfToken} />
 *   <input name="email" />
 *   <textarea name="message" />
 *   <button type="submit">Submit</button>
 * </form>
 */
export function CSRFProtectedForm({ csrfToken, onSubmit }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // TODO: Implement CSRF-protected form
  // 1. Validate csrfToken exists before submission
  // 2. Include CSRF token as hidden input
  // 3. Handle form submission with token

  return null;
}

CSRFProtectedForm.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

// =============================================================================
// EXERCISE 5: Safe Markdown Renderer
// =============================================================================

/**
 * Create a component that safely renders Markdown content.
 * Should parse Markdown and render as HTML with proper sanitization.
 *
 * Requirements:
 * - Accept markdown prop (string)
 * - Parse Markdown to HTML using marked or similar library
 * - Sanitize the resulting HTML
 * - Prevent XSS through Markdown syntax
 * - Allow safe HTML tags (p, h1-h6, ul, ol, li, em, strong, a, code, pre)
 * - Remove dangerous content
 *
 * Install: npm install marked dompurify
 *
 * Security considerations:
 * - Markdown can contain raw HTML
 * - Links in Markdown might use javascript: protocol
 * - Images might have onerror handlers
 *
 * Example:
 * Input: "# Hello\n[Click](javascript:alert('xss'))"
 * Output: <h1>Hello</h1><a>Click</a> (href sanitized)
 */
export function SafeMarkdownRenderer({ markdown }) {
  // TODO: Implement safe markdown rendering
  // 1. Import marked and DOMPurify
  // 2. Parse markdown to HTML
  // 3. Sanitize the HTML
  // 4. Render using dangerouslySetInnerHTML

  return null;
}

SafeMarkdownRenderer.propTypes = {
  markdown: PropTypes.string.isRequired
};

// =============================================================================
// EXERCISE 6: Secure Data Attribute Handler
// =============================================================================

/**
 * Create a component that safely handles data-* attributes.
 * Should sanitize attribute values to prevent XSS.
 *
 * Requirements:
 * - Accept dataAttributes object prop
 * - Apply data-* attributes to a div
 * - Sanitize attribute values (remove quotes, angle brackets, etc.)
 * - Log warning if dangerous content is detected
 *
 * Dangerous characters in attributes: < > " '
 *
 * Example:
 * Input: { userId: "123", tooltip: "<script>alert('xss')</script>" }
 * Output: <div data-user-id="123" data-tooltip="[sanitized]" />
 */
export function SecureDataAttributes({ dataAttributes, children }) {
  // TODO: Implement secure data attribute handling
  // 1. Sanitize each attribute value
  // 2. Apply as data-* attributes
  // 3. Warn if sanitization was needed

  return null;
}

SecureDataAttributes.propTypes = {
  dataAttributes: PropTypes.object.isRequired,
  children: PropTypes.node
};

// =============================================================================
// EXERCISE 7: Content Security Policy Reporter
// =============================================================================

/**
 * Create a component that handles CSP violation reports.
 * Should display CSP violations for debugging.
 *
 * Requirements:
 * - Listen for CSP violation events
 * - Display violation details in development
 * - Show: violated directive, blocked URI, source file
 * - Clean up event listener on unmount
 *
 * CSP violations occur when:
 * - Inline scripts are blocked
 * - Unsafe resources are loaded
 * - Eval is used when blocked
 *
 * Expected structure:
 * <div className="csp-violations">
 *   <h3>CSP Violations</h3>
 *   <ul>
 *     {violations.map(v => <li key={v.id}>{v.message}</li>)}
 *   </ul>
 * </div>
 */
export function CSPViolationReporter() {
  const [violations, setViolations] = useState([]);

  // TODO: Implement CSP violation reporter
  // 1. Add event listener for 'securitypolicyviolation'
  // 2. Store violation details
  // 3. Display violations
  // 4. Clean up on unmount

  return null;
}

// =============================================================================
// EXERCISE 8: Secure File Upload Component
// =============================================================================

/**
 * Create a secure file upload component.
 * Should validate file types, sizes, and prevent malicious uploads.
 *
 * Requirements:
 * - Accept allowedTypes and maxSize props
 * - Validate file type (check MIME type and extension)
 * - Validate file size
 * - Display error messages for invalid files
 * - Prevent execution of uploaded files
 * - Generate safe preview for images
 *
 * Security considerations:
 * - Check both MIME type and file extension
 * - Limit file size to prevent DoS
 * - Sanitize file names
 * - Don't trust client-side MIME types
 *
 * Example:
 * <SecureFileUpload
 *   allowedTypes={['image/jpeg', 'image/png']}
 *   maxSize={5 * 1024 * 1024}
 *   onUpload={handleUpload}
 * />
 */
export function SecureFileUpload({ allowedTypes, maxSize, onUpload }) {
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  // TODO: Implement secure file upload
  // 1. Validate file type against allowedTypes
  // 2. Validate file size against maxSize
  // 3. Sanitize filename
  // 4. Create safe preview for images
  // 5. Call onUpload with validated file

  return null;
}

SecureFileUpload.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxSize: PropTypes.number.isRequired,
  onUpload: PropTypes.func.isRequired
};

// =============================================================================
// EXERCISE 9: SQL Injection Prevention (Client-Side)
// =============================================================================

/**
 * Create a search component that safely handles user input for API queries.
 * Should prevent SQL injection attempts on the client side.
 *
 * Requirements:
 * - Accept searchQuery prop
 * - Validate and sanitize input
 * - Warn if SQL injection patterns detected
 * - Display sanitized query
 * - Provide feedback to user
 *
 * SQL injection patterns to detect:
 * - Single quotes (')
 * - SQL keywords: SELECT, DROP, INSERT, UPDATE, DELETE, UNION
 * - Comment syntax
 * - Semicolons in suspicious contexts
 *
 * Note: This is client-side validation only. Server-side validation
 * and parameterized queries are essential for real security.
 *
 * Expected behavior:
 * - Safe input: "hello world" -> allowed
 * - Dangerous input: "hello'; DROP TABLE users--" -> blocked with warning
 */
export function SafeSearchInput({ onSearch }) {
  const [query, setQuery] = useState('');
  const [warning, setWarning] = useState('');

  // TODO: Implement safe search input
  // 1. Detect SQL injection patterns
  // 2. Show warning if dangerous patterns found
  // 3. Sanitize or block dangerous input
  // 4. Call onSearch with safe query

  return null;
}

SafeSearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired
};

// =============================================================================
// EXERCISE 10: Secure Local Storage Handler
// =============================================================================

/**
 * Create a component that safely stores and retrieves data from localStorage.
 * Should prevent XSS through stored data.
 *
 * Requirements:
 * - Provide functions to save and load data
 * - Sanitize data before storing
 * - Validate data when retrieving
 * - Handle storage errors gracefully
 * - Never store sensitive data without encryption
 *
 * Security considerations:
 * - localStorage is accessible to all scripts on the domain
 * - Data persists across sessions
 * - Can be exploited if XSS vulnerability exists
 * - Should not store passwords, tokens, or PII
 *
 * Safe to store:
 * - User preferences
 * - UI state
 * - Non-sensitive cached data
 *
 * Not safe to store:
 * - Passwords
 * - API tokens
 * - Credit card info
 * - Personal identification
 */
export function SecureLocalStorage({ storageKey, initialValue, children }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  // TODO: Implement secure localStorage handling
  // 1. Load data from localStorage with validation
  // 2. Save data with sanitization
  // 3. Handle storage quota errors
  // 4. Provide context to children

  return null;
}

SecureLocalStorage.propTypes = {
  storageKey: PropTypes.string.isRequired,
  initialValue: PropTypes.any,
  children: PropTypes.node
};

// =============================================================================
// HELPER FUNCTIONS (for reference and testing)
// =============================================================================

/**
 * Validates if a URL uses a safe protocol
 */
export function isSafeUrl(url) {
  // TODO: Implement URL validation
  // Check if protocol is http, https, or mailto
  return false;
}

/**
 * Sanitizes a string for use in HTML attributes
 */
export function sanitizeAttribute(value) {
  // TODO: Implement attribute sanitization
  // Remove dangerous characters: < > " ' &
  return '';
}

/**
 * Detects potential SQL injection patterns
 */
export function detectSQLInjection(input) {
  // TODO: Implement SQL injection detection
  // Look for SQL keywords, quotes, comments
  return false;
}

/**
 * Validates file type by checking both MIME type and extension
 */
export function validateFileType(file, allowedTypes) {
  // TODO: Implement file type validation
  // Check both file.type and file.name extension
  return false;
}

/**
 * Sanitizes a filename for safe storage
 */
export function sanitizeFilename(filename) {
  // TODO: Implement filename sanitization
  // Remove path traversal attempts, special characters
  return '';
}
