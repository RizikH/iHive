const API_URL = 'https://ihive.onrender.com/api/ideas';

export const ideaService = {
  async saveContent(content) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: content.title,
          description: content.description,
          category: content.category || 'general'
        })
      });

      if (!response.ok) throw new Error('Failed to save content');
      return await response.json();
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  },

  async getAllContents() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch contents');
      return await response.json();
    } catch (error) {
      console.error('Error fetching contents:', error);
      throw error;
    }
  }
}; 