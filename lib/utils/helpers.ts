import { FormField } from "../types/form";

export const getDefaultValues = (fields: FormField[]) =>
    fields.reduce((acc, field) => {
        const fieldName = field.name || field.label;
        acc[fieldName] = field.varient === 'CheckBox' ? field.checked ?? false : field.value ?? '';
        return acc;
    }, {} as Record<string, any>);

export const shouldFieldBeVisible = (field: FormField, formValues: Record<string, any>) =>
    !field.dependsOn ||
    (field.dependsOn.condition === 'greaterThan' &&
        formValues[field.dependsOn.field] > field.dependsOn.value);