const normalizeApiBase = (baseUrl: string) => {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1');

function getToken(): string | null {
  return localStorage.getItem('fmcg_jwt_token');
}

export function setToken(token: string) {
  localStorage.setItem('fmcg_jwt_token', token);
}

export function removeToken() {
  localStorage.removeItem('fmcg_jwt_token');
}

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; code?: string; errors?: string[] };

function getErrorMessage(status: number, json: unknown, fallbackText: string): string {
  if (json && typeof json === 'object') {
    const body = json as { message?: unknown; code?: unknown; errors?: unknown };
    const parts = [
      typeof body.code === 'string' ? body.code : undefined,
      typeof body.message === 'string' ? body.message : undefined,
    ].filter(Boolean);

    if (Array.isArray(body.errors) && body.errors.length > 0) {
      parts.push(body.errors.filter((item): item is string => typeof item === 'string').join(', '));
    }

    if (parts.length > 0) {
      return parts.join(': ');
    }
  }

  if (fallbackText.trim()) {
    return fallbackText.trim();
  }

  return `API request failed with status ${status}`;
}

async function parseResponseBody<T>(response: Response): Promise<ApiEnvelope<T> | null> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    if (!response.ok) {
      throw new Error(getErrorMessage(response.status, null, text));
    }
    throw new Error('API returned an invalid JSON response.');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await parseResponseBody<T>(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, json, ''));
  }

  if (!json) {
    throw new Error('API returned an empty response.');
  }

  return json;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: any; tenant: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (data: any) =>
    request<{ token: string; user: any; tenant: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: any; tenant: any }>('/auth/me'),

  // Dashboard
  getDashboard: () => request<any>('/dashboard'),

  // Products
  getProducts: () => request<any[]>('/products'),
  createProduct: (data: any) => request<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request<any>(`/products/${id}`, { method: 'DELETE' }),

  // Inventory & Batches
  getBatches: () => request<any[]>('/inventory/batches'),
  getMovements: () => request<any[]>('/inventory/movements'),
  adjustStock: (data: any) => request<any>('/inventory/adjust', { method: 'POST', body: JSON.stringify(data) }),
  applyExpiryDiscount: (batchId: string, discountPercent: number) =>
    request<any>('/inventory/expiry-discount', { method: 'POST', body: JSON.stringify({ batchId, discountPercent }) }),
  writeOffBatch: (batchId: string) =>
    request<any>('/inventory/write-off', { method: 'POST', body: JSON.stringify({ batchId }) }),
  returnBatchToSupplier: (batchId: string) =>
    request<any>('/inventory/return-to-supplier', { method: 'POST', body: JSON.stringify({ batchId }) }),

  // Sales
  getSales: () => request<any[]>('/sales'),
  createSale: (data: any) => request<any>('/sales', { method: 'POST', body: JSON.stringify(data) }),

  // Purchases
  getPurchases: () => request<any[]>('/purchases'),
  createPurchase: (data: any) => request<any>('/purchases', { method: 'POST', body: JSON.stringify(data) }),

  // Collections
  getCollections: () => request<any[]>('/collections'),
  recordPayment: (data: any) => request<any>('/collections', { method: 'POST', body: JSON.stringify(data) }),

  // Customers
  getCustomers: () => request<any[]>('/customers'),
  createCustomer: (data: any) => request<any>('/customers', { method: 'POST', body: JSON.stringify(data) }),

  // Suppliers
  getSuppliers: () => request<any[]>('/suppliers'),
  createSupplier: (data: any) => request<any>('/suppliers', { method: 'POST', body: JSON.stringify(data) }),

  // Staff
  getStaff: () => request<any[]>('/staff'),
  inviteStaff: (data: any) => request<any>('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id: string, data: any) => request<any>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Audit Logs
  getAuditLogs: () => request<any[]>('/audit-logs'),

  // Tenant
  getTenant: () => request<any>('/tenant'),
  updateTenant: (data: any) => request<any>('/tenant', { method: 'PUT', body: JSON.stringify(data) }),

  // AI
  aiChat: (message: string) =>
    request<{ response: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  scanInvoice: (imageBase64: string, mimeType = 'image/jpeg') =>
    request<{ extractedData: string }>('/ai/scan-invoice', {
      method: 'POST',
      body: JSON.stringify({ message: 'scan', imageBase64, mimeType }),
    }),
};
