// API utility with fallback support
const LOCAL_API = 'http://localhost:5000';
const RENDER_API = 'https://phonecoverproject-1.onrender.com';

class APIClient {
  private async makeRequest(url: string, options: RequestInit): Promise<Response> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  }

  private async parseResponse(response: Response): Promise<any> {
    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Server returned empty response');
    }
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }
  }

  async post(endpoint: string, data: any): Promise<any> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    // Try local server first
    try {
      console.log('Trying local server:', `${LOCAL_API}${endpoint}`);
      const response = await this.makeRequest(`${LOCAL_API}${endpoint}`, options);
      console.log('Local server success');
      return await this.parseResponse(response);
    } catch (localError) {
      console.log('Local server failed, trying Render:', localError.message);
      
      // Fallback to Render
      try {
        console.log('Trying Render server:', `${RENDER_API}${endpoint}`);
        const response = await this.makeRequest(`${RENDER_API}${endpoint}`, options);
        console.log('Render server success');
        return await this.parseResponse(response);
      } catch (renderError) {
        console.error('Both servers failed:', renderError.message);
        throw new Error(`Failed to connect to both local and remote servers. Local: ${localError.message}, Remote: ${renderError.message}`);
      }
    }
  }

  async get(endpoint: string): Promise<any> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Try local server first
    try {
      console.log('Trying local server:', `${LOCAL_API}${endpoint}`);
      const response = await this.makeRequest(`${LOCAL_API}${endpoint}`, options);
      console.log('Local server success');
      return await this.parseResponse(response);
    } catch (localError) {
      console.log('Local server failed, trying Render:', localError.message);
      
      // Fallback to Render
      try {
        console.log('Trying Render server:', `${RENDER_API}${endpoint}`);
        const response = await this.makeRequest(`${RENDER_API}${endpoint}`, options);
        console.log('Render server success');
        return await this.parseResponse(response);
      } catch (renderError) {
        console.error('Both servers failed:', renderError.message);
        throw new Error(`Failed to connect to both local and remote servers. Local: ${localError.message}, Remote: ${renderError.message}`);
      }
    }
  }
}

export const apiClient = new APIClient();