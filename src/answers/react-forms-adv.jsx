/**
 * React Forms and Validation Exercises
 *
 * This file contains exercises covering React forms:
 * - Dynamic form generation
 * - File upload handling
 * - Form state management
 * - Custom form hooks
 */

import { useState, useRef, useReducer } from 'react';

// =============================================================================
// EXERCISE 1: Dynamic Form Generation
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
// EXERCISE 2: File Upload Handling
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
// EXERCISE 3: Form State Management
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
// EXERCISE 4: Custom Form Hooks
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
