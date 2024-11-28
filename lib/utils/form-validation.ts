import * as z from 'zod';
import { FormField } from '../types/form';

export const generateValidationSchema = (fields: FormField[]) => {
  const schemaObject: { [key: string]: z.ZodTypeAny } = {};

  fields.forEach((field) => {
    const fieldName = field.name || field.label;

    if (field.varient === 'Input' && field.type === 'number') {
      schemaObject[fieldName] = z.preprocess(
        (val) => (val === '' ? undefined : Number(val)), // Convert string to number
        z.number({ required_error: `${field.label} is required` }).refine(
          (val) => !isNaN(val),
          { message: `${field.label} must be a valid number` }
        )
      );
    } else if (field.varient === 'Input') {
      schemaObject[fieldName] = z
        .string({ required_error: `${field.label} is required` })
        .min(1, `${field.label} cannot be empty`);
    } else if (field.varient === 'CheckBox') {
      schemaObject[fieldName] = z.boolean().refine((val) => val === true, {
        message: `${field.label} must be checked`,
      });
    }
  });

  return z.object(schemaObject);
};