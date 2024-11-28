Dynamic Form Feature

Overview

A flexible and reusable Dynamic Form component built with Next.js, leveraging React Hook Form and Zod for validation. The form dynamically renders fields based on a JSON configuration, supports optimistic updates, and seamlessly integrates with APIs.

Key Features

	•	Dynamic Rendering: Automatically generates fields (Input, Checkbox, Select, etc.) from a JSON configuration.
	•	Validation: Uses Zod for schema-based validation with custom error messages.
	•	Optimistic Updates: Instant UI updates with rollback on API failure.
	•	API Management: Centralized API endpoint management with reusable utilities.
	•	Customizable: Easily extendable for new field types or advanced validation rules.

Setup

	1.	Clone the repository:

git clone <repo-url>
cd <repo-directory>


	2.	Install dependencies:

npm install


	3.	Start the development server:

npm run dev


	4.	Visit http://localhost:3000 to see the form.

Usage

Dynamic Form Integration

Use the DynamicForm component in your Next.js pages:

<DynamicForm
  fields={mockJson}        // JSON configuration for form fields
  onSubmit={handleSubmit}  // Submission handler
  title="Dynamic Form Example"
/>

API Endpoints

Centralized in apiEndpoints.ts:

export enum ApiEndpoints {
  FETCH_FORM_DATA = 'https://jsonplaceholder.typicode.com/posts/1',
  SUBMIT_FORM_DATA = 'https://jsonplaceholder.typicode.com/posts',
}

API Utility

Simplify API calls with fetchApi in api.ts:

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

Customization

	•	Add new field types or validation rules by extending the JSON configuration and DynamicFormField component.
	•	Example field configuration:

{
  label: 'Age',
  name: 'age',
  type: 'number',
  varient: 'Input',
  placeholder: 'Enter your age',
  required: true,
}

Error Handling

	•	Toast notifications for success or failure using sonner.
	•	Rollbacks for optimistic updates if API submission fails.

This Dynamic Form simplifies complex form handling, integrates seamlessly with APIs, and offers a great user experience.