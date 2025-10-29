import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { habitFormSchema, type HabitFormData } from '@/shared/lib/schemas';

export const useHabitForm = () => {
  return useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: '',
      description: '',
      weeklyTarget: 5
    }
  });
};

