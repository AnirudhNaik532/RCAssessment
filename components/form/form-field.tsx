'use client';

import { motion } from 'framer-motion';
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
  const fieldName = field.name || field.label;

  const handleChange = (val: any) => {
    onInteraction(fieldName);
    onChange(fieldName, val);
  };

  // Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  if (!visible) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-2"
    >
      {field.varient === 'Input' && (
        <div className="space-y-1">
          <Label
            htmlFor={fieldName}
            className={cn(field.required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
          >
            {field.label}
          </Label>
          {field.description && (
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {field.description}
            </motion.p>
          )}
          <Input
            id={fieldName}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            value={value || ''}
            onChange={(e) => {
              const val = field.type === 'number' ? +e.target.value : e.target.value;
              handleChange(val);
            }}
            className={cn(error && 'border-red-500')}
          />
          {error && (
            <motion.p
              className="text-sm text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
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
          {error && (
            <motion.p
              className="text-sm text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
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
                <motion.div
                  key={option.value}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                </motion.div>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <motion.p
              className="text-sm text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}