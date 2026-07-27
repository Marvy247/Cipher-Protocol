const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  async getTransactions(limit = 100) {
    const response = await fetch(`${API_BASE_URL}/api/v1/transactions?limit=${limit}`);
    return response.json();
  },

  async getTransaction(txHash: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/transactions/${txHash}`);
    return response.json();
  },

  async getRiskAlerts(limit = 50) {
    const response = await fetch(`${API_BASE_URL}/api/v1/risk-alerts?limit=${limit}`);
    return response.json();
  },

  async getAgentsStatus() {
    const response = await fetch(`${API_BASE_URL}/api/v1/agents/status`);
    return response.json();
  },

  async getOverviewStats() {
    const response = await fetch(`${API_BASE_URL}/api/v1/stats/overview`);
    return response.json();
  },

  async generateReport(startDate: string, endDate: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_date: startDate, end_date: endDate })
    });
    return response.json();
  },

  async checkSanctions(address: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/sanctions/check/${address}`);
    return response.json();
  },

  async getIntegrationUsage(limit = 100, service?: string) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (service) params.set('service', service);
    const response = await fetch(`${API_BASE_URL}/api/v1/integrations/usage?${params}`);
    return response.json();
  },

  async getIntegrationSummary() {
    const response = await fetch(`${API_BASE_URL}/api/v1/integrations/summary`);
    return response.json();
  }
};
