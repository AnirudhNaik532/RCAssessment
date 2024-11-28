'use client';

import { DynamicForm } from '@/components/form/dynamic-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { mockJson } from '@/lib/utils/constants';
import { ApiEndpoints } from '@/lib/apiEndPoints';
import { fetchApi } from '@/lib/utils/api';


export default function Home() {
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const data = await fetchApi(ApiEndpoints.FETCH_FORM_DATA);
      const updatedFields = mockJson.map((field) => {
        if (field.label === 'User Name') {
          return {
            ...field,
            label: data.title || field.label,
            description: data.body || field.description,
          };
        }
        return field;
      });
      setInitialData(updatedFields);
    } catch (error) {
      toast.error('Failed to fetch initial data');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const result = await fetchApi(ApiEndpoints.SUBMIT_FORM_DATA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit form');
    }
  };

  if (!initialData) {
    return (
      <main className="min-h-screen p-4 md:p-8 lg:p-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading form data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <DynamicForm
        fields={initialData}
        onSubmit={handleSubmit}
        title="Dynamic Form Example"
      />
    </main>
  );
}