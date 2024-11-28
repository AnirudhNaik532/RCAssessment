'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField } from '@/lib/types/form';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DynamicFormFieldProps {
  field: FormField;
  error?: string;
  onChange: (name: string, value: any) => void;
  value: any;
  onInteraction: (fieldName: string) => void;
  visible?: boolean;
}

export function DynamicFormField({
  field,
  error,
  onChange,
  value,
  onInteraction,
  visible = true,
}: DynamicFormFieldProps) {
  if (!visible) return null;

  const fieldName = field.name || field.label;

  const handleChange = (val: any) => {
    onInteraction(fieldName);
    onChange(fieldName, val);
  };

  return (
    <div className="space-y-2">
      {field.varient === 'Input' && (
        <div className="space-y-1">
          <Label
            htmlFor={fieldName}
            className={cn(field.required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
          >
            {field.label}
          </Label>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          <Input
            id={fieldName}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            value={value || ''}
            onChange={(e) => {
              const val = e.target.value;
              handleChange(field.type === 'number' ? val : e.target.value);
            }}
            className={cn(error && 'border-red-500')}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {field.varient === 'CheckBox' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={fieldName}
            checked={value || false}
            disabled={field.disabled}
            onCheckedChange={handleChange}
          />
          <Label
            htmlFor={fieldName}
            className={cn(
              'leading-none',
              field.required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
            )}
          >
            {field.label}
          </Label>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {field.varient === 'Select' && field.options && (
        <div className="space-y-1">
          <Label
            htmlFor={fieldName}
            className={cn(field.required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
          >
            {field.label}
          </Label>
          <Select value={value || ''} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}