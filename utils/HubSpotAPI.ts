export class HubSpotAPI {
    baseURL: string;
    accessToken: string;

    constructor() {
        this.baseURL = process.env.BASE_API_URL;
        this.accessToken = process.env.HUBSPOT_ACCESS_TOKEN || '';
        if (!this.accessToken) {
            throw new Error('HUBSPOT_ACCESS_TOKEN is not set in environment variables');
        }
    }

    async get(endpoint: string): Promise<any> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }

    async post(endpoint: string, data: any): Promise<any> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    async delete(endpoint: string) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('DELETE request error:', error);
            throw error;
        }
    }

    async getByContactId(endpoint: string) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Status: ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GET by ID error:', error);
            throw error;
        }
    }
}