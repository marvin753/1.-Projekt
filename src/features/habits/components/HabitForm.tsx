import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, Input } from '@/shared/ui';
import { habitFormSchema, type HabitFormData, type Habit } from '@/shared/lib/schemas';

interface HabitFormProps {
  /** Initial habit data for edit mode (undefined for create mode) */
  initialHabit?: Habit;
  /** Callback when form is submitted with valid data */
  onSubmit: (data: HabitFormData) => Promise<void>;
  /** Optional callback when cancel is clicked */
  onCancel?: () => void;
  /** Label for submit button */
  submitLabel?: string;
  /** Is the form currently submitting */
  isSubmitting?: boolean;
}

/**
 * Reusable form component for creating and editing habits
 * Features:
 * - Form validation using Zod schema
 * - Error messages for each field
 * - Accessibility (ARIA labels, error associations)
 * - Loading state during submission
 */
export function HabitForm({
  initialHabit,
  onSubmit,
  onCancel,
  submitLabel = 'Create Habit',
  isSubmitting = false
}: HabitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
    reset,
    setFocus
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: initialHabit?.title ?? '',
      description: initialHabit?.description ?? '',
      weeklyTarget: initialHabit?.weeklyTarget ?? 5
    },
    mode: 'onBlur' // Validate on blur for better UX
  });

  const loading = isSubmitting || formIsSubmitting;

  // Focus title field on mount for accessibility
  useEffect(() => {
    setFocus('title');
  }, [setFocus]);

  const handleFormSubmit = async (data: HabitFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error is handled by parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        {/* Title Field */}
        <div>
          <label
            htmlFor="habit-title"
            className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white"
          >
            Habit Name <span className="text-red-500" aria-label="required">*</span>
          </label>
          <Input
            id="habit-title"
            type="text"
            placeholder="e.g., Morning Exercise"
            disabled={loading}
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
          {errors.title && (
            <p id="title-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="habit-description"
            className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white"
          >
            Description <span className="text-gray-500 text-sm">(optional)</span>
          </label>
          <textarea
            id="habit-description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            rows={4}
            placeholder="Why is this habit important to you? What benefits do you expect?"
            disabled={loading}
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
            {...register('description')}
          />
          {errors.description && (
            <p id="description-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
              {errors.description.message}
            </p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Max 500 characters
          </p>
        </div>

        {/* Weekly Target Field */}
        <div>
          <label
            htmlFor="habit-weekly-target"
            className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white"
          >
            Weekly Target <span className="text-red-500" aria-label="required">*</span>
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="habit-weekly-target"
              type="number"
              min="1"
              max="7"
              placeholder="5"
              disabled={loading}
              className="w-20"
              aria-invalid={errors.weeklyTarget ? 'true' : 'false'}
              aria-describedby={errors.weeklyTarget ? 'weeklyTarget-error' : 'weeklyTarget-hint'}
              {...register('weeklyTarget', { valueAsNumber: true })}
            />
            <span id="weeklyTarget-hint" className="text-gray-600 dark:text-gray-400 text-sm">
              days per week
            </span>
          </div>
          {errors.weeklyTarget && (
            <p id="weeklyTarget-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
              {errors.weeklyTarget.message}
            </p>
          )}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <button
                key={day}
                type="button"
                disabled={loading}
                className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={`Set target to ${day} days`}
                onClick={() => {
                  const input = document.getElementById('habit-weekly-target') as HTMLInputElement;
                  if (input) {
                    input.value = day.toString();
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading && <span className="mr-2">⟳</span>}
            {submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              aria-label="Cancel and go back"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Accessibility: Help text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p><span className="text-red-500">*</span> = Required field</p>
        </div>
      </form>
    </Card>
  );
}
