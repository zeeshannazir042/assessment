import { z } from 'zod';

export const workOrderBaseSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(80, 'Title cannot exceed 80 characters'),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .default(''),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Open', 'In Progress', 'Done']).default('Open'),
});

export const createWorkOrderSchema = workOrderBaseSchema.strict();

export const updateWorkOrderSchema = workOrderBaseSchema.strict();

export const zodErrorToFieldMap = (err: z.ZodError) => {
  const fieldErrors: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || 'form';
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
};
