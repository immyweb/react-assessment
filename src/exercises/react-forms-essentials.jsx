/**
 * React Forms and Validation Exercises
 *
 * This file contains exercises covering React forms:
 * - Controlled form patterns
 * - Form validation strategies
 * - Accessibility in forms
 * - useFormStatus
 * - useActionState
 * - React Hook Form
 * - Zod validation
 *
 */

import { useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

// =============================================================================
// EXERCISE 3: Accessibility in Forms
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
// EXERCISE 4: useFormStatus
// =============================================================================

/**
 * Create a submit button that uses useFormStatus.
 * Demonstrates pending state from form submission.
 *
 * Requirements:
 * - Create SubmitButton component that uses useFormStatus
 * - Show "Submitting..." when pending is true
 * - Show "Submit" when not pending
 * - Disable button when pending
 * - Button should have type="submit"
 * - Form should have an action that simulates async submission
 * - Button text data-testid="button-text"
 *
 * Note: useFormStatus must be called in a component that is a child
 * of a form with an action prop.
 */
export function UseFormStatusButton() {
  // TODO: Implement form with useFormStatus in child component
  // Hint: useFormStatus returns { pending, data, method, action }
  // Must be used in a component rendered inside <form action={...}>
}

/**
 * Create a form with multiple submit buttons using useFormStatus.
 * Different buttons trigger different actions.
 *
 * Requirements:
 * - Form with title and content inputs
 * - Two submit buttons: "Save Draft" and "Publish"
 * - Use useFormStatus to show which action is pending
 * - Buttons show: "Saving..." or "Publishing..." when pending
 * - Use formAction prop on buttons for different actions
 * - Disable both buttons while any action is pending
 * - Create separate action functions: saveDraft and publish
 * - Actions should take FormData and return result after 1s delay
 *
 * Button data-testids: "save-button", "publish-button"
 */
export function MultiActionFormStatus({ onSaveDraft, onPublish }) {
  // TODO: Implement form with multiple actions
  // Hint: Use formAction prop on buttons to specify different actions
  // useFormStatus will reflect the current pending action
}

function MultiActionButton({ action, testId, text, textPending }) {}

/**
 * Create a form with a loading indicator using useFormStatus.
 * Show a progress indicator separate from the submit button.
 *
 * Requirements:
 * - Form with email and message inputs
 * - Submit button
 * - Separate LoadingIndicator component using useFormStatus
 * - LoadingIndicator shows "Processing form..." when pending
 * - LoadingIndicator has data-testid="loading-indicator"
 * - LoadingIndicator should only show when form is pending
 * - Form submission simulates 2s delay
 *
 * LoadingIndicator should be a sibling of form fields, not the button
 */
export function FormStatusWithIndicator({ onSubmit }) {
  // TODO: Implement form with separate loading indicator
  // Hint: LoadingIndicator is a separate component using useFormStatus
}

function LoadingIndicator() {}

/**
 * Create a form that shows which field was submitted with useFormStatus.
 * Access FormData from useFormStatus.
 *
 * Requirements:
 * - Form with name, email, and phone inputs
 * - Submit button
 * - Status display component using useFormStatus
 * - Status shows submitted field values while pending
 * - Status has data-testid="form-status"
 * - Display format: "Submitting: {name}, {email}, {phone}"
 * - Only show status when pending
 * - Clear status after submission completes
 */
export function FormStatusWithData({ onSubmit }) {
  // TODO: Implement form that displays submitted data
  // Hint: useFormStatus().data gives you access to FormData
  // Use FormData methods to extract values
}

function StatusIndicator() {}

// =============================================================================
// EXERCISE 5: useActionState
// =============================================================================

/**
 * Create a form using useActionState for state management.
 * Basic useActionState implementation.
 *
 * Requirements:
 * - Form with username and email inputs
 * - Use useActionState to manage form state and submission
 * - Action function validates inputs and returns state
 * - Show success message when submission succeeds
 * - Show error message when validation fails
 * - Validation: username min 3 chars, email valid format
 * - Success state shows data-testid="success-message"
 * - Error state shows data-testid="error-message"
 * - Form action receives previous state and FormData
 *
 * State structure: { success: boolean, message: string, errors?: object }
 */
export function UseActionStateBasic() {
  // TODO: Implement form with useActionState
  // Hint: const [state, formAction] = useActionState(action, initialState)
  // action(prevState, formData) => newState
}

/**
 * Create a multi-step form using useActionState.
 * Manage wizard-style form progression.
 *
 * Requirements:
 * - Three steps: Personal Info, Contact Info, Review
 * - Step 1: firstName, lastName (both required)
 * - Step 2: email, phone (email required)
 * - Step 3: Review all data with Edit and Submit buttons
 * - Use useActionState to manage current step and data
 * - Next button advances to next step if valid
 * - Back button returns to previous step
 * - Show current step number: data-testid="current-step"
 * - Validate each step before advancing
 * - Final submit calls onSubmit prop with all data
 *
 * State structure: { step: number, data: object, errors: object }
 */
export function MultiStepActionState({ onSubmit }) {
  // TODO: Implement multi-step form with useActionState
  // Hint: Action function handles different button names (next, back, submit)
  // Use hidden input or button value to determine action type
}

/**
 * Create a form with field-level errors using useActionState.
 * Display validation errors for each field.
 *
 * Requirements:
 * - Registration form: username, email, password, confirmPassword
 * - Use useActionState to manage form state and errors
 * - Validation rules:
 *   * username: required, min 3 chars, alphanumeric only
 *   * email: required, valid email format
 *   * password: required, min 8 chars, must contain uppercase and number
 *   * confirmPassword: must match password
 * - Show field-specific errors below each input
 * - Errors have data-testid="error-{fieldname}"
 * - Only show errors after submission attempt
 * - Clear errors on successful submission
 *
 * State structure: { errors: { username?, email?, password?, confirmPassword? }, success: boolean }
 */
export function FieldErrorsActionState({ onSubmit }) {
  // TODO: Implement field-level validation with useActionState
  // Hint: Action function validates each field and returns errors object
  // Render errors conditionally for each field
}

// =============================================================================
// EXERCISE 6: React Hook Form
// =============================================================================

/**
 * Create a basic form using React Hook Form.
 * Introduction to react-hook-form library.
 *
 * Requirements:
 * - Install and import: useForm from 'react-hook-form'
 * - Form fields: name, email, age (number)
 * - Use register() to register inputs
 * - Use handleSubmit() wrapper for form submission
 * - Show validation errors from formState.errors
 * - Validation rules:
 *   * name: required, minLength: 2
 *   * email: required, pattern: email regex
 *   * age: required, min: 18, max: 100
 * - Error messages have className "error"
 * - Submit calls onSubmit prop with data
 *
 * Example: <input {...register("name", { required: true })} />
 */
export function ReactHookFormBasic({ onSubmit }) {
  // TODO: Implement form with react-hook-form
  // Hint: const { register, handleSubmit, formState: { errors } } = useForm()
  // <form onSubmit={handleSubmit(onSubmit)}>
}

/**
 * Create a form with custom validation using React Hook Form.
 * Use custom validation functions.
 *
 * Requirements:
 * - Form fields: username, password, confirmPassword
 * - Use register with custom validate functions
 * - Username validation: async check if available (not "admin", "user", "test")
 * - Password validation: custom function checking strength
 * - ConfirmPassword validation: must match password (use watch())
 * - Show validation errors with specific messages
 * - Disable submit while validating (use formState.isValidating)
 * - Success message on valid submission: data-testid="success"
 *
 * Custom validate syntax: validate: { ruleName: (value) => true | "error message" }
 */
export function ReactHookFormCustomValidation({ onSubmit }) {
  // TODO: Implement custom validation with react-hook-form
  // Hint: Use watch("password") to access password value for confirm validation
  // validate: async (value) => { await checkAvailability(value); return true; }
}

/**
 * Create a dynamic form array using React Hook Form.
 * Add/remove form fields dynamically.
 *
 * Requirements:
 * - Form for user with multiple phone numbers
 * - Fields: name, email, phones array
 * - Each phone has: type (mobile/home/work), number
 * - Use useFieldArray hook for phones
 * - Add phone button: data-testid="add-phone"
 * - Remove phone button for each: data-testid="remove-phone-{index}"
 * - Validate: name required, email required, at least 1 phone
 * - Phone number validation: required, matches pattern
 * - Phone list has data-testid="phone-list"
 *
 * Default: Start with 1 empty phone field
 */
export function ReactHookFormFieldArray({ onSubmit }) {
  // TODO: Implement field array with react-hook-form
  // Hint: const { fields, append, remove } = useFieldArray({ control, name: "phones" })
  // fields.map((field, index) => <input {...register(`phones.${index}.number`)} />)
}

/**
 * Create a form with React Hook Form and controlled components.
 * Integration with controlled inputs.
 *
 * Requirements:
 * - Form fields: title, description, category (select), tags (multi-input)
 * - Use Controller for controlled components
 * - Category select with options: tech, design, business
 * - Tags: custom TagInput component (controlled)
 * - Title and description use standard register
 * - All fields required
 * - Show character count for description (max 200)
 * - Character count: data-testid="char-count"
 * - Submit disabled if description > 200 chars
 *
 * TagInput props: value, onChange (array of strings)
 */
export function ReactHookFormControlled({ onSubmit }) {
  // TODO: Implement controlled components with react-hook-form
  // Hint: Use Controller component from react-hook-form
  // <Controller name="category" control={control} render={({ field }) => <select {...field}>} />
}

function TagInput({ value = [], onChange, id }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div>
        {value.map((tag, index) => (
          <div key={index}>
            <span>{tag}</span>
            <button type="button" onClick={() => handleRemoveTag(tag)}>
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        name={id}
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Type and press Enter"
      />
    </div>
  );
}

// =============================================================================
// EXERCISE 7: Zod validation
// =============================================================================

/**
 * Create a form with Zod schema validation.
 * Introduction to Zod validation library.
 *
 * Requirements:
 * - Install and import: z from 'zod'
 * - Define Zod schema for user registration
 * - Fields: username, email, password, age
 * - Schema validation rules:
 *   * username: string, min 3, max 20, alphanumeric
 *   * email: valid email format
 *   * password: min 8 chars, contains uppercase, number, special char
 *   * age: number, min 18, max 120
 * - Validate form data with schema.parse()
 * - Display validation errors
 * - Errors have data-testid="error-{fieldname}"
 * - Submit only if validation passes
 *
 * Example schema: z.object({ name: z.string().min(2) })
 */

export function ZodBasicValidation({ onSubmit }) {
  // TODO: Implement Zod validation
  // Hint: Define schema outside component
  // const schema = z.object({ ... })
  // try { schema.parse(data) } catch (error) { /* handle errors */ }
}

/**
 * Create a form with Zod and React Hook Form integration.
 * Use zodResolver for seamless integration.
 *
 * Requirements:
 * - Install: @hookform/resolvers
 * - Import: zodResolver from '@hookform/resolvers/zod'
 * - Form fields: name, email, website, bio
 * - Zod schema validation:
 *   * name: required, min 2 chars
 *   * email: valid email
 *   * website: optional, but if provided must be valid URL
 *   * bio: optional, max 500 chars
 * - Use zodResolver in useForm
 * - Display validation errors from formState.errors
 * - Show remaining characters for bio: data-testid="bio-remaining"
 * - Submit button disabled during validation
 *
 * Integration: useForm({ resolver: zodResolver(schema) })
 */

export function ZodWithReactHookForm({ onSubmit }) {
  // TODO: Implement Zod with React Hook Form
  // Hint: const schema = z.object({ ... })
  // const { register, handleSubmit, formState, watch } = useForm({
  //   resolver: zodResolver(schema)
  // })
}

/**
 * Create a form with Zod custom refinements.
 * Advanced Zod validation patterns.
 *
 * Requirements:
 * - Form fields: password, confirmPassword, birthDate, agreeToTerms
 * - Zod schema with custom refinements:
 *   * password: min 8 chars, custom refine for strength (uppercase, number, special)
 *   * confirmPassword: must match password (use refine with path)
 *   * birthDate: must be at least 18 years ago (use refine)
 *   * agreeTerms: must be true (custom error message)
 * - Display custom error messages
 * - Use .refine() and .superRefine() methods
 * - Errors have data-testid="error-{fieldname}"
 * - Show specific error messages for each validation failure
 *
 * Refine syntax: .refine((data) => condition, { message, path })
 */

export function ZodCustomRefinements({ onSubmit }) {
  // TODO: Implement custom Zod refinements
  // Hint: Use .refine() for cross-field validation
  // schema.refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwords must match",
  //   path: ["confirmPassword"]
  // })
}

/**
 * Create a form with Zod transforms and preprocessing.
 * Data transformation with Zod.
 *
 * Requirements:
 * - Form fields: email, phone, price, tags (comma-separated string)
 * - Zod schema with transforms:
 *   * email: trim and lowercase before validation
 *   * phone: remove all non-numeric characters, then validate length
 *   * price: parse string to number, validate positive
 *   * tags: transform comma-separated string to array, trim each
 * - Display transformed values after validation: data-testid="transformed-data"
 * - Show original vs transformed side-by-side
 * - Submit transformed data
 *
 * Transform syntax: z.string().transform((val) => val.trim().toLowerCase())
 * Preprocess syntax: z.preprocess((val) => transform(val), z.string())
 */

export function ZodTransforms({ onSubmit }) {
  // TODO: Implement Zod transforms and preprocessing
  // Hint: Use .transform() to modify values after validation
  // Use z.preprocess() to modify values before validation
  // const schema = z.object({
  //   email: z.string().email().transform(val => val.toLowerCase())
  // })
}

// =============================================================================
// Helper Functions
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

/**
 * Check string is alphanumeric
 */
function isAlphaNumeric(str) {
  return str
    .split('')
    .every(
      (char) =>
        (char >= 'A' && char <= 'Z') ||
        (char >= 'a' && char <= 'z') ||
        (char >= '0' && char <= '9')
    );
}
