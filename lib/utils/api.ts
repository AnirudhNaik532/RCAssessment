export async function fetchApi(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }