import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { habitSchema, type HabitFormData } from '@/shared/lib/schemas';

export const useHabitForm = () => {
  return useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: '',
      description: '',
      color: '#3b82f6',
      frequency: 'daily'
    }
  });
};

