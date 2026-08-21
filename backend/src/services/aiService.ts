import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { productRepository } from '../repositories/productRepository.js';
import { batchRepository } from '../repositories/batchRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { saleRepository } from '../repositories/saleRepository.js';
import { collectionRepository } from '../repositories/collectionRepository.js';
import { AppError } from '../utils/AppError.js';

function getClient() {
  if (!env.GEMINI_API_KEY) throw AppError.badRequest('AI features require a configured GEMINI_API_KEY');
  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export const aiService = {
  async chat(tenantId: string, message: string) {
    const client = getClient();

    // Gather live business context
    const products = productRepository.findByTenant(tenantId);
    batchRepository.updateDaysToExpiry(tenantId);
    const nearExpiry = batchRepository.findNearExpiry(tenantId, 30);
    const customers = customerRepository.findByTenant(tenantId);
    const today = new Date().toISOString().split('T')[0];
    const recentSales = saleRepository.findByTenant(tenantId, { startDate: today });

    const context = `
You are an AI business assistant for an FMCG distribution company.

INVENTORY SNAPSHOT (${products.length} products):
${products.slice(0, 20).map((p: any) => `- ${p.sku}: ${p.name}, Stock: ${p.in_stock}, Status: ${p.status}`).join('\n')}
${products.length > 20 ? `...and ${products.length - 20} more products` : ''}

NEAR-EXPIRY BATCHES (${nearExpiry.length} batches within 30 days):
${nearExpiry.slice(0, 10).map((b: any) => `- ${b.sku}: ${b.product_name}, Qty: ${b.quantity}, Expires: ${b.expiry_date} (${b.days_to_expiry} days)`).join('\n')}

CUSTOMERS (${customers.length} total):
- Total outstanding receivables: $${customers.reduce((s: number, c: any) => s + c.outstanding_balance, 0).toFixed(2)}
- Customers with overdue: ${customers.filter((c: any) => c.overdue_amount > 0).length}

TODAY'S SALES: ${recentSales.length} transactions

Answer questions about inventory, sales trends, expiry risks, receivables, and supply chain in a concise, structured manner.
Always provide specific numbers and actionable recommendations.
    `.trim();

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: `${context}\n\nUser question: ${message}` }] }],
    });

    return response.text ?? 'No response generated';
  },

  async scanInvoice(tenantId: string, base64Image: string, mimeType = 'image/jpeg') {
    const client = getClient();

    const products = productRepository.findByTenant(tenantId);
    const skuList = products.map((p: any) => `${p.sku}: ${p.name}`).join('\n');

    const prompt = `You are an AI invoice scanner for an FMCG distribution system.
Extract all line items from this supplier invoice image.

Known product SKUs for matching:
${skuList}

Return a JSON array of items with this exact structure:
[
  {
    "lineText": "original line from invoice",
    "matchedSku": "SKU if matched, null if not",
    "matchedProductName": "product name if matched, null if not",
    "quantity": number,
    "freeQuantity": 0,
    "unitPrice": number,
    "totalAmount": number,
    "batchNumber": "batch number if visible, else generated",
    "expiryDate": "YYYY-MM-DD if visible, else null",
    "confidence": "high|medium|low",
    "needsReview": boolean
  }
]

Return ONLY the JSON array, no other text.`;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: base64Image } },
            { text: prompt },
          ],
        }],
      });

      const text = response.text ?? '[]';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return { items: [], rawResponse: text };

      const items = JSON.parse(jsonMatch[0]);
      return { items, rawResponse: text };
    } catch (err) {
      logger.error('AI invoice scan failed', { error: String(err) });
      throw AppError.internal('Invoice scanning failed. Please try again.');
    }
  },

  async getOptimizations(tenantId: string) {
    const client = getClient();

    batchRepository.updateDaysToExpiry(tenantId);
    const products = productRepository.findByTenant(tenantId);
    const nearExpiry = batchRepository.findNearExpiry(tenantId, 30);
    const customers = customerRepository.findByTenant(tenantId);
    const today = new Date().toISOString().split('T')[0];
    const monthStart = today.substring(0, 7) + '-01';
    const sales = saleRepository.findByTenant(tenantId, { startDate: monthStart });

    const lowStock = products.filter((p: any) => p.status === 'Low' || p.status === 'Out of Stock');
    const overdue = customers.filter((c: any) => c.overdue_amount > 0);

    const context = `
Analyze this FMCG distribution business data and return optimization recommendations as JSON.

LOW STOCK ITEMS (${lowStock.length}):
${lowStock.map((p: any) => `- ${p.sku}: ${p.name}, Stock: ${p.in_stock}, Threshold: ${p.min_threshold}`).join('\n')}

NEAR EXPIRY BATCHES (${nearExpiry.length}):
${nearExpiry.map((b: any) => `- ${b.sku}: ${b.product_name}, Qty: ${b.quantity}, Expires in ${b.days_to_expiry} days`).join('\n')}

OVERDUE CUSTOMERS (${overdue.length}):
${overdue.slice(0, 5).map((c: any) => `- ${c.name}: Overdue $${c.overdue_amount}`).join('\n')}

MONTHLY SALES: ${sales.length} transactions, Total: $${sales.reduce((s: number, r: any) => s + r.total_amount, 0).toFixed(2)}

Return a JSON array of recommendations:
[
  {
    "type": "reorder|expiry|collection|pricing",
    "title": "short title",
    "description": "detailed recommendation",
    "sku": "relevant SKU or null",
    "actionLabel": "button label",
    "severity": "high|medium|low"
  }
]
Return ONLY the JSON array.`;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: context }] }],
      });

      const text = response.text ?? '[]';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      logger.error('AI optimizer failed', { error: String(err) });
      return [];
    }
  },
};
