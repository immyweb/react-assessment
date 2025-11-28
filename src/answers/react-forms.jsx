/**
 * React Forms and Validation Exercises
 *
 * This file contains exercises covering React forms:
 * - Controlled form patterns
 * - Form validation strategies
 * - Dynamic form generation
 * - File upload handling
 * - Form state management
 * - Custom form hooks
 * - Accessibility in forms
 *
 * Each exercise includes:
 * - Clear documentation with examples
 * - Expected behavior description
 * - Component requirements
 * - Test cases to validate implementation
 */

import React, { useState, useRef, useReducer } from 'react';

// =============================================================================
// EXERCISE 1: Controlled Form Patterns
// =============================================================================

/**
 * Create a simple controlled form with text inputs.
 * All inputs should be controlled (value bound to state).
 *
 * Requirements:
 * - Name input (text)
 * - Email input (email type)
 * - Message textarea
 * - Submit button
 * - All inputs controlled with state
 * - onSubmit callback receives form data: { name, email, message }
 * - Prevent default form submission
 * - Clear form after successful submission
 *
 * Accessibility:
 * - Proper labels for all inputs
 * - Associated with htmlFor/id
 */
export function ControlledForm({ onSubmit }) {
  // TODO: Implement controlled form
  // Hint: Use individual state for each field or single state object
}

/**
 * Create a controlled form with multiple input types.
 * Demonstrates handling different input types in controlled manner.
 *
 * Requirements:
 * - Text input for username
 * - Email input
 * - Password input (type="password")
 * - Number input for age
 * - Select dropdown for country (US, UK, Canada, Other)
 * - Checkbox for "agree to terms"
 * - Radio buttons for role (user, admin)
 * - Submit button (disabled if terms not agreed)
 * - onSubmit receives all form data
 * - Clear form after submission
 *
 * Accessibility:
 * - All inputs have labels
 * - Fieldset/legend for radio group
 */
export function MultiInputForm({ onSubmit }) {
  // TODO: Implement form with multiple input types
}

/**
 * Create a controlled form with nested object state.
 * Demonstrates managing complex form state structure.
 *
 * Requirements:
 * - Form data structure: { personal: { firstName, lastName }, contact: { email, phone } }
 * - Four inputs: firstName, lastName, email, phone
 * - Update nested state properly
 * - Display current state as JSON (data-testid="form-state")
 * - Submit button
 * - onSubmit receives nested object
 *
 * State structure:
 * {
 *   personal: { firstName: '', lastName: '' },
 *   contact: { email: '', phone: '' }
 * }
 */
export function NestedStateForm({ onSubmit }) {
  // TODO: Implement form with nested state
  // Hint: Use spread operator to update nested objects immutably
}

// =============================================================================
// EXERCISE 2: Form Validation Strategies
// =============================================================================

/**
 * Create a form with real-time validation.
 * Show validation errors as user types.
 *
 * Requirements:
 * - Email input with validation
 * - Password input with validation rules:
 *   * Min 8 characters
 *   * At least one uppercase letter
 *   * At least one number
 * - Show errors below each field (className "error")
 * - Validate on change (real-time)
 * - Submit button disabled if form invalid
 * - onSubmit only called if valid
 *
 * Error messages:
 * - Email: "Invalid email format"
 * - Password: "Password must be at least 8 characters", etc.
 */
export function RealtimeValidationForm({ onSubmit }) {
  // TODO: Implement real-time validation
  // Hint: Validate in onChange handlers, store errors in state
}

/**
 * Create a form with validation on blur (touched fields).
 * Only show errors for fields that have been touched.
 *
 * Requirements:
 * - Name input (required, min 2 characters)
 * - Email input (required, valid format)
 * - Phone input (optional, but if filled must match pattern)
 * - Track touched state for each field
 * - Show errors only for touched fields
 * - Validate on blur
 * - Submit validates all and shows all errors
 * - Error messages have className "error"
 *
 * Phone pattern: XXX-XXX-XXXX or (XXX) XXX-XXXX
 */
export function TouchedValidationForm({ onSubmit }) {
  // TODO: Implement validation on blur with touched tracking
}

/**
 * Create a form with async validation.
 * Simulate checking if username is available.
 *
 * Requirements:
 * - Username input
 * - Check availability on blur (simulate 500ms API call)
 * - Show "Checking..." while validating
 * - Show "Username taken" or "Username available"
 * - Submit disabled while checking or if taken
 * - Available usernames: Any except "admin", "user", "test"
 * - Use data-testid="validation-status" for status message
 *
 * States: idle, checking, available, taken
 */
export function AsyncValidationForm({ onSubmit }) {
  // TODO: Implement async validation
  // Hint: Use setTimeout to simulate API call, useEffect for cleanup
}

/**
 * Create a form with custom validation schema.
 * Demonstrates validation function pattern.
 *
 * Requirements:
 * - Define validation schema object
 * - Validate function that checks all rules
 * - Form fields: email, password, confirmPassword
 * - Validation rules:
 *   * email: required, valid format
 *   * password: required, min 8 chars
 *   * confirmPassword: required, must match password
 * - Show all errors or field-specific errors
 * - Validate on submit
 * - Display errors with data-testid="error-{fieldName}"
 */
export function SchemaValidationForm({ onSubmit }) {
  // TODO: Implement schema-based validation
  // Hint: Create validateForm function that returns errors object
}

// =============================================================================
// EXERCISE 3: Dynamic Form Generation
// =============================================================================

/**
 * Create a dynamic form generator from field configuration.
 * Generates form inputs based on config array.
 *
 * Requirements:
 * - Accept fields prop (array of field configs)
 * - Generate inputs dynamically
 * - Support types: text, email, number, select, textarea
 * - Each field config: { name, label, type, required, options? }
 * - Render appropriate input for each type
 * - Handle form submission with dynamic data
 * - All inputs properly labeled
 *
 * Example config:
 * [
 *   { name: 'username', label: 'Username', type: 'text', required: true },
 *   { name: 'country', label: 'Country', type: 'select', options: ['US', 'UK'] }
 * ]
 */
export function DynamicFormGenerator({ fields, onSubmit }) {
  // TODO: Implement dynamic form generation
  // Hint: Map over fields array, render appropriate input component
}

/**
 * Create a repeatable field group (array of items).
 * Allows adding/removing field groups dynamically.
 *
 * Requirements:
 * - Initial state: one empty experience entry
 * - Each entry has: company, position, years
 * - "Add Experience" button to add new entry
 * - "Remove" button for each entry (except if only one)
 * - Submit sends array of all experiences
 * - Each entry wrapped in div with data-testid="experience-entry"
 *
 * Data structure: [{ company: '', position: '', years: '' }]
 */
export function RepeatableFieldForm({ onSubmit }) {
  // TODO: Implement repeatable field groups
  // Hint: Use array state, map to render, add/remove items
}

/**
 * Create a conditional form with dependent fields.
 * Show/hide fields based on other field values.
 *
 * Requirements:
 * - Account type select: "personal" or "business"
 * - Name input (always shown)
 * - If personal: show "Date of Birth" input
 * - If business: show "Company Name" and "Tax ID" inputs
 * - Submit sends only relevant fields
 * - All conditional fields have data-testid matching field name
 *
 * States managed conditionally based on accountType
 */
export function ConditionalForm({ onSubmit }) {
  // TODO: Implement conditional form fields
  // Hint: Conditionally render based on accountType state
}

/**
 * Create a multi-step form wizard.
 * Form split into multiple steps with navigation.
 *
 * Requirements:
 * - Three steps: "Personal", "Contact", "Review"
 * - Step 1: firstName, lastName
 * - Step 2: email, phone
 * - Step 3: Review all data (read-only)
 * - "Next" button (disabled on last step)
 * - "Previous" button (disabled on first step)
 * - "Submit" button (only on review step)
 * - Track current step
 * - Display step indicator (data-testid="current-step")
 * - Validate before allowing next step
 */
export function MultiStepForm({ onSubmit }) {
  // TODO: Implement multi-step form wizard
  // Hint: Track step number, conditionally render step content
}

// =============================================================================
// EXERCISE 4: File Upload Handling
// =============================================================================

/**
 * Create a basic file upload input with preview.
 * Handle single file upload.
 *
 * Requirements:
 * - File input (accept images only: .jpg, .png, .gif)
 * - Show selected file name
 * - Show image preview if file selected
 * - "Clear" button to reset
 * - onSubmit receives File object
 * - Preview image has data-testid="file-preview"
 * - File name display has data-testid="file-name"
 *
 * Accessibility:
 * - Label for file input
 * - Alt text for preview image
 */
export function FileUploadForm({ onSubmit }) {
  // TODO: Implement file upload with preview
  // Hint: Use FileReader API for preview, URL.createObjectURL
}

/**
 * Create a multiple file upload with validation.
 * Handle multiple files with size/type validation.
 *
 * Requirements:
 * - File input with multiple attribute
 * - Accept only images (image/*)
 * - Max file size: 2MB per file
 * - Show list of selected files with sizes
 * - Remove individual files from selection
 * - Show error for invalid files (data-testid="upload-error")
 * - Each file item has data-testid="file-item"
 * - Submit sends array of valid File objects
 *
 * Validation:
 * - File type must be image/*
 * - File size <= 2MB (2097152 bytes)
 */
export function MultiFileUploadForm({ onSubmit }) {
  // TODO: Implement multiple file upload with validation
}

/**
 * Create a drag-and-drop file upload area.
 * Support both click and drag-drop.
 *
 * Requirements:
 * - Drop zone with visual feedback
 * - Support click to open file picker
 * - Support drag and drop
 * - Show "Drop files here" or "Click to upload"
 * - Highlight drop zone on drag over (className "drag-over")
 * - Display uploaded file name
 * - Accept only PDF files (.pdf)
 * - onSubmit receives File object
 *
 * Events: dragOver, dragLeave, drop
 */
export function DragDropUploadForm({ onSubmit }) {
  // TODO: Implement drag-and-drop upload
  // Hint: Handle dragOver (preventDefault), drop events
}

// =============================================================================
// EXERCISE 5: Form State Management
// =============================================================================

/**
 * Create a form using useReducer for complex state.
 * Demonstrates reducer pattern for form state.
 *
 * Requirements:
 * - Use useReducer for form state
 * - Actions: UPDATE_FIELD, RESET_FORM, SET_ERRORS, SUBMIT
 * - State: { values: {}, errors: {}, isSubmitting: boolean }
 * - Fields: username, email, password
 * - Validate on submit
 * - Show validation errors
 * - Disable submit while submitting
 *
 * Reducer should handle all state updates
 */
export function ReducerForm({ onSubmit }) {
  // TODO: Implement form with useReducer
  // Hint: Define reducer function, dispatch actions for updates
}

/**
 * Create a form with undo/redo functionality.
 * Track form history and allow undo/redo.
 *
 * Requirements:
 * - Text inputs: title, description
 * - Track history of form states
 * - "Undo" button (disabled if no history)
 * - "Redo" button (disabled if no future states)
 * - Submit current state
 * - Show current history position (data-testid="history-position")
 *
 * History: [state0, state1, state2, ...]
 * Position: index in history array
 */
export function UndoRedoForm({ onSubmit }) {
  // TODO: Implement undo/redo functionality
  // Hint: Maintain history array and current position index
}

/**
 * Create a form with draft auto-save.
 * Automatically save to localStorage while editing.
 *
 * Requirements:
 * - Inputs: title, content (textarea)
 * - Auto-save to localStorage every 2 seconds after change
 * - Load draft from localStorage on mount
 * - Show "Draft saved" indicator (data-testid="save-status")
 * - "Clear Draft" button
 * - Submit final version
 * - localStorage key: "form-draft"
 *
 * Auto-save should debounce (wait for typing to stop)
 */
export function AutoSaveForm({ onSubmit }) {
  // TODO: Implement auto-save functionality
  // Hint: Use useEffect with setTimeout for debouncing
}

// =============================================================================
// EXERCISE 6: Custom Form Hooks
// =============================================================================

/**
 * Create a custom useForm hook for form state management.
 * Reusable hook for any form.
 *
 * Requirements:
 * - Hook accepts: initialValues, validate, onSubmit
 * - Returns: { values, errors, handleChange, handleSubmit, resetForm }
 * - handleChange updates field value
 * - handleSubmit validates and calls onSubmit if valid
 * - validate is optional function: (values) => errors
 * - resetForm clears to initial values
 *
 * Usage in component:
 * const form = useForm({ initialValues, validate, onSubmit })
 */
export function useForm(config) {
  // TODO: Implement custom form hook
  // Hint: Use useState for values and errors, return handlers
}

/**
 * Create a custom useFieldValidation hook.
 * Reusable hook for individual field validation.
 *
 * Requirements:
 * - Hook accepts: value, rules (array of validation rules)
 * - Returns: { error, validate, isValid }
 * - Rules: [{ test: (value) => boolean, message: string }]
 * - validate() runs all rules, sets first error found
 * - isValid is true if no errors
 *
 * Example rules:
 * [
 *   { test: (v) => v.length >= 3, message: 'Min 3 characters' },
 *   { test: (v) => /\d/.test(v), message: 'Must contain number' }
 * ]
 */
export function useFieldValidation(value, rules = []) {
  // TODO: Implement field validation hook
}

/**
 * Create a component using the useForm hook.
 * Demonstrates custom hook usage.
 *
 * Requirements:
 * - Use the useForm hook created above
 * - Fields: name, email, age
 * - Validation: name required (min 2), email required (valid format), age > 0
 * - Display validation errors
 * - Submit button
 * - Reset button
 *
 * This tests that useForm hook works correctly
 */
export function FormWithCustomHook({ onSubmit }) {
  // TODO: Implement form using useForm hook
  // Use the useForm hook defined above
}

/**
 * Create a custom useFileInput hook.
 * Reusable hook for file input handling.
 *
 * Requirements:
 * - Hook accepts: options { accept, maxSize, multiple }
 * - Returns: { file/files, error, handleChange, clear, preview }
 * - Validates file type and size
 * - Generates preview URL for images
 * - preview is URL or null
 * - Clean up URL on unmount
 *
 * Single file mode: file is File object or null
 * Multiple mode: files is array
 */
export function useFileInput(options = {}) {
  // TODO: Implement file input hook
  // Hint: Use useRef for cleanup, useEffect for URL.revokeObjectURL
}

// =============================================================================
// EXERCISE 7: Accessibility in Forms
// =============================================================================

/**
 * Create a fully accessible form.
 * Demonstrates all accessibility best practices.
 *
 * Requirements:
 * - All inputs have associated labels (htmlFor/id)
 * - Required fields marked with aria-required
 * - Error messages associated with aria-describedby
 * - Error messages have role="alert" for screen readers
 * - Fieldset and legend for grouped inputs
 * - Submit button shows loading state with aria-busy
 * - Focus management (focus first error on submit)
 *
 * Fields: firstName, lastName, email, subscribe (checkbox), role (radio)
 * Validation: firstName and email required
 */
export function AccessibleForm({ onSubmit }) {
  // TODO: Implement accessible form
  // Focus on ARIA attributes and proper HTML structure
}

/**
 * Create a form with keyboard navigation support.
 * Enhanced keyboard interaction.
 *
 * Requirements:
 * - Standard tab navigation works
 * - Enter key submits form (from any input)
 * - Escape key clears form
 * - Keyboard shortcut: Ctrl/Cmd + S saves draft
 * - Show keyboard shortcuts hint (data-testid="shortcuts-hint")
 * - Inputs: title, description
 * - Save draft to localStorage
 *
 * Prevent default behavior for shortcuts
 */
export function KeyboardNavigationForm({ onSubmit }) {
  // TODO: Implement keyboard navigation
  // Hint: Use onKeyDown handlers, check key codes
}

/**
 * Create a form with live validation announcements.
 * Screen reader announces validation status.
 *
 * Requirements:
 * - Email and password inputs
 * - Live region for announcements (aria-live="polite")
 * - Announce validation errors to screen readers
 * - Announce successful validation
 * - Visual error messages below fields
 * - Live region has data-testid="live-region"
 *
 * Announcements:
 * - "Email is invalid" / "Email is valid"
 * - "Password is too short" / "Password is valid"
 */
export function LiveValidationForm({ onSubmit }) {
  // TODO: Implement live validation announcements
  // Hint: Use aria-live region that updates with validation messages
}

/**
 * Create a form with focus trap for modal.
 * Trap focus within form while modal is open.
 *
 * Requirements:
 * - Modal overlay with form
 * - isOpen prop controls visibility
 * - Focus trapped within modal when open
 * - Focus first input on modal open
 * - Tab cycles through form elements only
 * - Shift+Tab cycles backward
 * - Escape closes modal
 * - Return focus to trigger element on close
 * - Close button and submit button
 *
 * Modal should have role="dialog" and aria-modal="true"
 */
export function FocusTrapForm({ isOpen, onClose, onSubmit }) {
  // TODO: Implement focus trap
  // Hint: Use refs to track focusable elements, manage focus on tab
}

// =============================================================================
// Helper Functions (DO NOT MODIFY - Used by tests)
// =============================================================================

/**
 * Validate email format.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength.
 */
export function validatePassword(password) {
  const errors = [];
  if (password.length < 8)
    errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password))
    errors.push('Password must contain uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain number');
  return errors;
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
