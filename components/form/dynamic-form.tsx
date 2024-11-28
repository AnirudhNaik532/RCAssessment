'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormField, FormStats } from '@/lib/types/form';
import { generateValidationSchema } from '@/lib/utils/form-validation';
import { DynamicFormField } from './form-field';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getDefaultValues, shouldFieldBeVisible } from '@/lib/utils/helpers';

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  title?: string;
}

export function DynamicForm({ fields, onSubmit, title }: DynamicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<FormStats>({ interactions: {}, totalInteractions: 0 });

  const validationSchema = generateValidationSchema(fields);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: getDefaultValues(fields),
  });

  const handleInteraction = (fieldName: string) => {
    setStats((prev) => ({
      interactions: { ...prev.interactions, [fieldName]: (prev.interactions[fieldName] || 0) + 1 },
      totalInteractions: prev.totalInteractions + 1,
    }));
  };

  const handleReset = () => {
    reset(getDefaultValues(fields));
    setStats({ interactions: {}, totalInteractions: 0 });
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedFields = fields.sort((a, b) => a.rowIndex - b.rowIndex);
  const formValues = watch();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {title && (
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">{title}</h2>
          <p className="text-center text-sm text-muted-foreground">
            Total interactions: {stats.totalInteractions}
          </p>
        </CardHeader>
      )}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          {sortedFields.map((field) => (
            <DynamicFormField
              key={field.name || field.label}
              field={field}
              error={errors[field.name || field.label]?.message as string}
              onChange={(name, value) => setValue(name, value, { shouldValidate: true })}
              value={formValues[field.name || field.label]}
              onInteraction={handleInteraction}
              visible={shouldFieldBeVisible(field, formValues)}
            />
          ))}
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}