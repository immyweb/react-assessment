/**
 * React Forms and Validation Tests
 *
 * Test suite for React forms exercises covering:
 * - Dynamic form generation
 * - File upload handling
 * - Form state management
 * - Custom form hooks
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

import {
  DynamicFormGenerator,
  RepeatableFieldForm,
  ConditionalForm,
  MultiStepForm,
  FileUploadForm,
  MultiFileUploadForm,
  DragDropUploadForm,
  ReducerForm,
  UndoRedoForm,
  AutoSaveForm,
  useForm,
  FormWithCustomHook
} from '../exercises/react-forms';

// =============================================================================
// EXERCISE 1 TESTS: Dynamic Form Generation
// =============================================================================

describe('Exercise 1: Dynamic Form Generation', () => {
  describe('DynamicFormGenerator', () => {
    const fields = [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'age', label: 'Age', type: 'number', required: false },
      { name: 'bio', label: 'Bio', type: 'textarea', required: false },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: ['US', 'UK', 'Canada']
      }
    ];

    it('should render all fields from config', () => {
      render(<DynamicFormGenerator fields={fields} onSubmit={vi.fn()} />);

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Age')).toBeInTheDocument();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('should render correct input types', () => {
      render(<DynamicFormGenerator fields={fields} onSubmit={vi.fn()} />);

      expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA');
      expect(screen.getByLabelText('Country').tagName).toBe('SELECT');
    });

    it('should handle form submission with dynamic data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<DynamicFormGenerator fields={fields} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Age'), '25');
      await user.selectOptions(screen.getByLabelText('Country'), 'UK');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          age: '25',
          country: 'UK'
        })
      );
    });

    it('should handle empty fields array', () => {
      render(<DynamicFormGenerator fields={[]} onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });
  });

  describe('RepeatableFieldForm', () => {
    it('should render one entry initially', () => {
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);
      expect(screen.getAllByTestId('experience-entry')).toHaveLength(1);
    });

    it('should have add button', () => {
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /add.*experience/i })
      ).toBeInTheDocument();
    });

    it('should add new entry when add button clicked', async () => {
      const user = userEvent.setup();
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);

      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );
      expect(screen.getAllByTestId('experience-entry')).toHaveLength(2);
    });

    it('should have remove button for each entry', async () => {
      const user = userEvent.setup();
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);

      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('should remove entry when remove button clicked', async () => {
      const user = userEvent.setup();
      render(<RepeatableFieldForm onSubmit={vi.fn()} />);

      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );
      await user.click(
        screen.getByRole('button', { name: /add.*experience/i })
      );

      expect(screen.getAllByTestId('experience-entry')).toHaveLength(3);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(screen.getAllByTestId('experience-entry')).toHaveLength(2);
    });

    it('should submit array of experiences', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<RepeatableFieldForm onSubmit={onSubmit} />);

      const companyInputs = screen.getAllByLabelText(/company/i);
      await user.type(companyInputs[0], 'Acme Corp');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ company: 'Acme Corp' })
        ])
      );
    });
  });

  describe('ConditionalForm', () => {
    it('should render account type select', () => {
      render(<ConditionalForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/account.*type/i)).toBeInTheDocument();
    });

    it('should show date of birth for personal account', async () => {
      const user = userEvent.setup();
      render(<ConditionalForm onSubmit={vi.fn()} />);

      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'personal'
      );
      expect(screen.getByTestId('dateOfBirth')).toBeInTheDocument();
    });

    it('should show company fields for business account', async () => {
      const user = userEvent.setup();
      render(<ConditionalForm onSubmit={vi.fn()} />);

      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'business'
      );
      expect(screen.getByTestId('companyName')).toBeInTheDocument();
      expect(screen.getByTestId('taxId')).toBeInTheDocument();
    });

    it('should not show personal fields for business account', async () => {
      const user = userEvent.setup();
      render(<ConditionalForm onSubmit={vi.fn()} />);

      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'business'
      );
      expect(screen.queryByTestId('dateOfBirth')).not.toBeInTheDocument();
    });

    it('should submit only relevant fields', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ConditionalForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.selectOptions(
        screen.getByLabelText(/account.*type/i),
        'business'
      );
      await user.type(screen.getByTestId('companyName'), 'Acme Inc');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          accountType: 'business',
          companyName: 'Acme Inc'
        })
      );
    });
  });

  describe('MultiStepForm', () => {
    it('should show step 1 initially', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });

    it('should render first and last name inputs on step 1', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/first.*name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last.*name/i)).toBeInTheDocument();
    });

    it('should have next and previous buttons', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /previous/i })
      ).toBeInTheDocument();
    });

    it('should disable previous button on first step', () => {
      render(<MultiStepForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    });

    it('should advance to step 2 when next clicked', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByTestId('current-step')).toHaveTextContent('2');
    });

    it('should show email and phone on step 2', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('should show submit button on review step', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.type(screen.getByLabelText(/last.*name/i), 'Doe');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await user.type(screen.getByLabelText(/email/i), 'john@test.com');
      await user.type(screen.getByLabelText(/phone/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should go back to previous step', async () => {
      const user = userEvent.setup();
      render(<MultiStepForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/first.*name/i), 'John');
      await user.click(screen.getByRole('button', { name: /next/i }));
      await user.click(screen.getByRole('button', { name: /previous/i }));

      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });
  });
});

// =============================================================================
// EXERCISE 2 TESTS: File Upload Handling
// =============================================================================

describe('Exercise 2: File Upload Handling', () => {
  describe('FileUploadForm', () => {
    it('should render file input', () => {
      render(<FileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload|image/i);
      expect(input).toHaveAttribute('type', 'file');
    });

    it('should accept only images', () => {
      render(<FileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload|image/i);
      const accept = input.getAttribute('accept');
      expect(accept).toMatch(/\.jpg|\.png|\.gif|image/i);
    });

    it('should display file name when file selected', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = screen.getByLabelText(/file|upload|image/i);

      await user.upload(input, file);

      expect(screen.getByTestId('file-name')).toHaveTextContent('hello.png');
    });

    it('should show file preview', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = screen.getByLabelText(/file|upload|image/i);

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });
    });

    it('should have clear button', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      await user.upload(screen.getByLabelText(/file|upload|image/i), file);

      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('should clear file when clear button clicked', async () => {
      const user = userEvent.setup();
      render(<FileUploadForm onSubmit={vi.fn()} />);

      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      await user.upload(screen.getByLabelText(/file|upload|image/i), file);
      await user.click(screen.getByRole('button', { name: /clear/i }));

      expect(screen.queryByTestId('file-name')).not.toBeInTheDocument();
    });
  });

  describe('MultiFileUploadForm', () => {
    it('should render file input with multiple attribute', () => {
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload/i);
      expect(input).toHaveAttribute('multiple');
    });

    it('should accept only images', () => {
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);
      const input = screen.getByLabelText(/file|upload/i);
      expect(input.getAttribute('accept')).toMatch(/image/i);
    });

    it('should display list of selected files', async () => {
      const user = userEvent.setup();
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);

      const files = [
        new File(['file1'], 'file1.png', { type: 'image/png' }),
        new File(['file2'], 'file2.jpg', { type: 'image/jpeg' })
      ];

      const input = screen.getByLabelText(/file|upload/i);
      await user.upload(input, files);

      expect(screen.getAllByTestId('file-item')).toHaveLength(2);
    });

    it('should show error for files exceeding size limit', async () => {
      const user = userEvent.setup();
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);

      // Create file larger than 2MB
      const largeFile = new File(['x'.repeat(3000000)], 'large.png', {
        type: 'image/png'
      });

      const input = screen.getByLabelText(/file|upload/i);
      await user.upload(input, largeFile);

      expect(screen.getByTestId('upload-error')).toBeInTheDocument();
    });

    it('should allow removing individual files', async () => {
      const user = userEvent.setup();
      render(<MultiFileUploadForm onSubmit={vi.fn()} />);

      const files = [
        new File(['file1'], 'file1.png', { type: 'image/png' }),
        new File(['file2'], 'file2.png', { type: 'image/png' })
      ];

      await user.upload(screen.getByLabelText(/file|upload/i), files);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(screen.getAllByTestId('file-item')).toHaveLength(1);
    });
  });

  describe('DragDropUploadForm', () => {
    it('should render drop zone', () => {
      render(<DragDropUploadForm onSubmit={vi.fn()} />);
      expect(screen.getByText(/drop.*here|click.*upload/i)).toBeInTheDocument();
    });

    it('should accept only PDF files', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const input = container.querySelector('input[type="file"]');
      expect(input?.getAttribute('accept')).toMatch(/\.pdf|application\/pdf/i);
    });

    it('should add drag-over class on drag over', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const dropZone = container.querySelector('[class*="drop"]');

      fireEvent.dragOver(dropZone);
      expect(dropZone).toHaveClass('drag-over');
    });

    it('should remove drag-over class on drag leave', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const dropZone = container.querySelector('[class*="drop"]');

      fireEvent.dragOver(dropZone);
      fireEvent.dragLeave(dropZone);

      expect(dropZone).not.toHaveClass('drag-over');
    });

    it('should handle file drop', () => {
      const { container } = render(<DragDropUploadForm onSubmit={vi.fn()} />);
      const dropZone = container.querySelector('[class*="drop"]');

      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf'
      });
      const dataTransfer = { files: [file] };

      fireEvent.drop(dropZone, { dataTransfer });

      expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument();
    });
  });
});

// =============================================================================
// EXERCISE 3 TESTS: Form State Management
// =============================================================================

describe('Exercise 3: Form State Management', () => {
  describe('ReducerForm', () => {
    it('should render form inputs', () => {
      render(<ReducerForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should update state on input change', async () => {
      const user = userEvent.setup();
      render(<ReducerForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
    });

    it('should disable submit while submitting', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      render(<ReducerForm onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/username/i), 'test');
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should show validation errors', async () => {
      const user = userEvent.setup();
      render(<ReducerForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should show validation errors
      const errors = screen.queryAllByText(/required|invalid/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('UndoRedoForm', () => {
    it('should render undo and redo buttons', () => {
      render(<UndoRedoForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    });

    it('should disable undo initially', () => {
      render(<UndoRedoForm onSubmit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    });

    it('should enable undo after input change', async () => {
      const user = userEvent.setup();
      render(<UndoRedoForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/title/i), 'Test');

      expect(screen.getByRole('button', { name: /undo/i })).not.toBeDisabled();
    });

    it('should undo changes', async () => {
      const user = userEvent.setup();
      render(<UndoRedoForm onSubmit={vi.fn()} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');
      await user.click(screen.getByRole('button', { name: /undo/i }));

      expect(titleInput).toHaveValue('');
    });

    it('should redo changes', async () => {
      const user = userEvent.setup();
      render(<UndoRedoForm onSubmit={vi.fn()} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');
      await user.click(screen.getByRole('button', { name: /undo/i }));
      await user.click(screen.getByRole('button', { name: /redo/i }));

      expect(titleInput).toHaveValue('Test');
    });

    it('should show history position', () => {
      render(<UndoRedoForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('history-position')).toBeInTheDocument();
    });
  });

  describe('AutoSaveForm', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render title and content inputs', () => {
      render(<AutoSaveForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    });

    it('should show save status', () => {
      render(<AutoSaveForm onSubmit={vi.fn()} />);
      expect(screen.getByTestId('save-status')).toBeInTheDocument();
    });

    it('should auto-save to localStorage', async () => {
      const user = userEvent.setup({ delay: null });
      render(<AutoSaveForm onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/title/i), 'Test Title');

      vi.advanceTimersByTime(2000);

      await waitFor(() => {
        const saved = localStorage.getItem('form-draft');
        expect(saved).toBeTruthy();
        expect(JSON.parse(saved).title).toBe('Test Title');
      });
    });

    it('should load draft from localStorage on mount', () => {
      localStorage.setItem(
        'form-draft',
        JSON.stringify({ title: 'Saved Title', content: 'Saved Content' })
      );

      render(<AutoSaveForm onSubmit={vi.fn()} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('Saved Title');
      expect(screen.getByLabelText(/content/i)).toHaveValue('Saved Content');
    });

    it('should have clear draft button', () => {
      render(<AutoSaveForm onSubmit={vi.fn()} />);
      expect(
        screen.getByRole('button', { name: /clear.*draft/i })
      ).toBeInTheDocument();
    });

    it('should clear draft from localStorage', async () => {
      const user = userEvent.setup();
      localStorage.setItem('form-draft', JSON.stringify({ title: 'Test' }));

      render(<AutoSaveForm onSubmit={vi.fn()} />);
      await user.click(screen.getByRole('button', { name: /clear.*draft/i }));

      expect(localStorage.getItem('form-draft')).toBeNull();
    });
  });
});

// =============================================================================
// EXERCISE 4 TESTS: Custom Form Hooks
// =============================================================================

describe('Exercise 4: Custom Form Hooks', () => {
  describe('useForm hook', () => {
    function TestComponent() {
      const form = useForm({
        initialValues: { name: '', email: '' },
        validate: (values) => {
          const errors = {};
          if (!values.name) errors.name = 'Name required';
          if (!values.email) errors.email = 'Email required';
          return errors;
        },
        onSubmit: vi.fn()
      });

      return (
        <form onSubmit={form.handleSubmit}>
          <input
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
          />
          <input
            name="email"
            value={form.values.email}
            onChange={form.handleChange}
          />
          {form.errors.name && <span>{form.errors.name}</span>}
          <button type="submit">Submit</button>
          <button type="button" onClick={form.resetForm}>
            Reset
          </button>
        </form>
      );
    }

    it('should initialize with initial values', () => {
      render(<TestComponent />);
      expect(screen.getByRole('textbox', { name: '' })).toHaveValue('');
    });

    it('should handle input changes', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'John');

      expect(inputs[0]).toHaveValue('John');
    });

    it('should validate on submit', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Name required')).toBeInTheDocument();
    });

    it('should reset form', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'John');
      await user.click(screen.getByRole('button', { name: /reset/i }));

      expect(inputs[0]).toHaveValue('');
    });
  });

  describe('FormWithCustomHook', () => {
    it('should render form with custom hook', () => {
      render(<FormWithCustomHook onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    });

    it('should validate using custom hook', async () => {
      const user = userEvent.setup();
      render(<FormWithCustomHook onSubmit={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      const errors = screen.queryAllByText(/required|invalid|min/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reset form using custom hook', async () => {
      const user = userEvent.setup();
      render(<FormWithCustomHook onSubmit={vi.fn()} />);

      await user.type(screen.getByLabelText(/name/i), 'Test');
      await user.click(screen.getByRole('button', { name: /reset/i }));

      expect(screen.getByLabelText(/name/i)).toHaveValue('');
    });
  });
});
