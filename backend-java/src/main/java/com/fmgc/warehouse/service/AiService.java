package com.fmgc.warehouse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.dto.request.AiChatRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Batch;
import com.fmgc.warehouse.model.Customer;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.model.Sale;
import com.fmgc.warehouse.model.Supplier;
import com.fmgc.warehouse.repository.BatchRepository;
import com.fmgc.warehouse.repository.CustomerRepository;
import com.fmgc.warehouse.repository.ProductRepository;
import com.fmgc.warehouse.repository.SaleRepository;
import com.fmgc.warehouse.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final CustomerRepository customerRepository;
    private final SaleRepository saleRepository;
    private final SupplierRepository supplierRepository;
    private final ObjectMapper objectMapper;

    public AiService(ProductRepository productRepository,
                     BatchRepository batchRepository,
                     CustomerRepository customerRepository,
                     SaleRepository saleRepository,
                     SupplierRepository supplierRepository,
                     ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.customerRepository = customerRepository;
        this.saleRepository = saleRepository;
        this.supplierRepository = supplierRepository;
        this.objectMapper = objectMapper;
    }

    // ── Chat ─────────────────────────────────────────────────────────────────

    public Map<String, Object> chat(AiChatRequest req, String tenantId) {
        checkApiKey();
        String context = buildBusinessContext(tenantId);
        String prompt = buildChatPrompt(context, req.getMessage());
        String response = callGemini(prompt);
        return Map.of("response", response);
    }

    // ── Invoice scan ──────────────────────────────────────────────────────────

    public Map<String, Object> scanInvoice(AiChatRequest req, String tenantId) {
        checkApiKey();
        if (req.getImageBase64() == null || req.getImageBase64().isBlank()) {
            throw new AppException(400, "VALIDATION_ERROR", "imageBase64 is required");
        }

        // Build list of known SKUs to help Gemini match product names
        List<Product> products = productRepository.findByTenantId(tenantId);
        String skuList = products.stream()
                .map(p -> p.getSku() + ": " + p.getName())
                .collect(Collectors.joining("\n"));

        String prompt = """
You are an AI invoice scanner for an FMCG distribution system.
Extract all line items from this supplier invoice image.

Known product SKUs for matching:
%s

Return a JSON array of items with this EXACT structure (no extra text, just JSON):
[
  {
    "productName": "name as written on invoice",
    "matchedSku": "SKU if matched from list above, null if not matched",
    "quantity": <integer>,
    "freeQuantity": <integer, 0 if not mentioned>,
    "unitPrice": <number>,
    "totalAmount": <number>,
    "batchNumber": "batch/lot number if visible, else generate one like BATCH-001",
    "expiryDate": "YYYY-MM-DD if visible, else null",
    "confidence": "high or medium or low",
    "needsReview": <true if uncertain match, false if confident>
  }
]
Return ONLY the JSON array, no markdown, no explanation.
""".formatted(skuList);

        String response = callGeminiWithImage(prompt, req.getImageBase64(),
                req.getMimeType() != null ? req.getMimeType() : "image/jpeg");
        return Map.of("extractedData", response);
    }

    // ── Optimizations ─────────────────────────────────────────────────────────

    public Map<String, Object> getOptimizations(String tenantId) {
        checkApiKey();

        List<Product> lowStock = productRepository.findByTenantId(tenantId).stream()
                .filter(p -> p.getInStock() != null && p.getMinThreshold() != null
                        && p.getInStock() <= p.getMinThreshold())
                .collect(Collectors.toList());

        List<Batch> nearExpiry = batchRepository.findByTenantId(tenantId).stream()
                .filter(b -> b.getExpiryDate() != null && b.getQuantity() != null && b.getQuantity() > 0)
                .filter(b -> {
                    // compute days to expiry from expiry_date string (YYYY-MM-DD)
                    try {
                        java.time.LocalDate exp = java.time.LocalDate.parse(b.getExpiryDate().substring(0, 10));
                        long days = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), exp);
                        return days <= 30;
                    } catch (Exception e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());

        List<Customer> overdueCustomers = customerRepository.findByTenantId(tenantId).stream()
                .filter(c -> c.getOverdueAmount() != null
                        && c.getOverdueAmount().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());

        String prompt = """
Analyze this FMCG warehouse data and provide exactly 4 actionable optimization recommendations.
Return a JSON array (no extra text):

LOW STOCK PRODUCTS (%d items):
%s

NEAR EXPIRY BATCHES within 30 days (%d batches):
%s

OVERDUE CUSTOMER ACCOUNTS (%d customers):
%s

JSON format:
[{"type":"reorder|expiry|collection|pricing","title":"short title","description":"actionable recommendation","sku":"SKU or null","actionLabel":"button label","severity":"high|medium|low"}]
""".formatted(
                lowStock.size(),
                lowStock.stream().map(p -> "- " + p.getSku() + ": " + p.getName()
                        + " (stock:" + p.getInStock() + ", threshold:" + p.getMinThreshold() + ")")
                        .collect(Collectors.joining("\n")),
                nearExpiry.size(),
                nearExpiry.stream().map(b -> "- " + b.getSku() + ": " + b.getProductName()
                        + " qty:" + b.getQuantity() + " exp:" + b.getExpiryDate())
                        .collect(Collectors.joining("\n")),
                overdueCustomers.size(),
                overdueCustomers.stream().map(c -> "- " + c.getName()
                        + " overdue: ₹" + c.getOverdueAmount())
                        .collect(Collectors.joining("\n")));

        String response = callGemini(prompt);
        return Map.of(
                "recommendations", response,
                "lowStockCount", lowStock.size(),
                "nearExpiryCount", nearExpiry.size(),
                "overdueCustomerCount", overdueCustomers.size());
    }

    // ── Context builder ───────────────────────────────────────────────────────

    private String buildBusinessContext(String tenantId) {
        // Products
        List<Product> products = productRepository.findByTenantId(tenantId);
        List<Product> lowStock = products.stream()
                .filter(p -> p.getInStock() != null && p.getMinThreshold() != null
                        && p.getInStock() <= p.getMinThreshold())
                .collect(Collectors.toList());
        List<Product> outOfStock = products.stream()
                .filter(p -> p.getInStock() != null && p.getInStock() == 0)
                .collect(Collectors.toList());

        // Batches near expiry
        List<Batch> allBatches = batchRepository.findByTenantId(tenantId);
        List<Batch> nearExpiry = allBatches.stream()
                .filter(b -> b.getExpiryDate() != null && b.getQuantity() != null && b.getQuantity() > 0)
                .filter(b -> {
                    try {
                        java.time.LocalDate exp = java.time.LocalDate.parse(b.getExpiryDate().substring(0, 10));
                        long days = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), exp);
                        return days <= 30 && days >= 0;
                    } catch (Exception e) { return false; }
                })
                .collect(Collectors.toList());

        // Customers
        List<Customer> customers = customerRepository.findByTenantId(tenantId);
        BigDecimal totalReceivables = customers.stream()
                .map(c -> c.getOutstandingBalance() != null ? c.getOutstandingBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<Customer> overdueCustomers = customers.stream()
                .filter(c -> c.getOverdueAmount() != null && c.getOverdueAmount().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());

        // Sales
        List<Sale> sales = saleRepository.findByTenantId(tenantId);
        BigDecimal totalRevenue = sales.stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Recent 5 sales
        List<Sale> recentSales = sales.stream().limit(5).collect(Collectors.toList());

        // Suppliers
        List<Supplier> suppliers = supplierRepository.findByTenantId(tenantId);
        BigDecimal totalPayables = suppliers.stream()
                .map(s -> s.getPayableBalance() != null ? s.getPayableBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Stock value
        BigDecimal stockValue = products.stream()
                .map(p -> {
                    if (p.getInStock() == null || p.getSellingPrice() == null) return BigDecimal.ZERO;
                    return p.getSellingPrice().multiply(BigDecimal.valueOf(p.getInStock()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return """
=== FMGC WAREHOUSE BUSINESS CONTEXT (Live Data, INR ₹) ===

INVENTORY SUMMARY:
- Total SKUs: %d
- Low stock items: %d
- Out of stock items: %d
- Estimated stock value: ₹%s

ALL PRODUCTS:
%s

LOW STOCK PRODUCTS (below threshold):
%s

NEAR-EXPIRY BATCHES (within 30 days):
%s

CUSTOMER ACCOUNTS (%d total):
- Total receivables outstanding: ₹%s
- Customers with overdue amounts: %d
%s

SALES DATA (%d total sales, ₹%s total revenue):
Recent sales:
%s

SUPPLIER ACCOUNTS (%d suppliers):
- Total payables: ₹%s
%s

TODAY'S DATE: %s
CURRENCY: Indian Rupees (INR, ₹)
""".formatted(
                products.size(),
                lowStock.size(),
                outOfStock.size(),
                stockValue.toPlainString(),

                products.stream().map(p -> "  - [" + p.getSku() + "] " + p.getName()
                        + " | Stock: " + p.getInStock()
                        + " | Price: ₹" + (p.getSellingPrice() != null ? p.getSellingPrice().toPlainString() : "0")
                        + " | Status: " + p.getStatus())
                        .collect(Collectors.joining("\n")),

                lowStock.isEmpty() ? "  None" : lowStock.stream()
                        .map(p -> "  - [" + p.getSku() + "] " + p.getName()
                                + " stock:" + p.getInStock() + " threshold:" + p.getMinThreshold())
                        .collect(Collectors.joining("\n")),

                nearExpiry.isEmpty() ? "  None" : nearExpiry.stream()
                        .map(b -> "  - [" + b.getSku() + "] " + b.getProductName()
                                + " qty:" + b.getQuantity() + " expiry:" + b.getExpiryDate()
                                + " batch:" + b.getBatchNumber())
                        .collect(Collectors.joining("\n")),

                customers.size(),
                totalReceivables.toPlainString(),
                overdueCustomers.size(),
                customers.stream().map(c -> "  - " + c.getName()
                        + " | Outstanding: ₹" + (c.getOutstandingBalance() != null ? c.getOutstandingBalance() : 0)
                        + " | Overdue: ₹" + (c.getOverdueAmount() != null ? c.getOverdueAmount() : 0)
                        + " | Credit limit: ₹" + (c.getCreditLimit() != null ? c.getCreditLimit() : 0))
                        .collect(Collectors.joining("\n")),

                sales.size(),
                totalRevenue.toPlainString(),
                recentSales.stream().map(s -> "  - " + s.getInvoiceNumber()
                        + " | " + s.getCustomerName()
                        + " | ₹" + (s.getTotalAmount() != null ? s.getTotalAmount() : 0)
                        + " | " + s.getDate()
                        + " | " + s.getPaymentStatus())
                        .collect(Collectors.joining("\n")),

                suppliers.size(),
                totalPayables.toPlainString(),
                suppliers.stream().map(s -> "  - " + s.getName()
                        + " | Payable: ₹" + (s.getPayableBalance() != null ? s.getPayableBalance() : 0)
                        + " | Total purchases: ₹" + (s.getTotalPurchases() != null ? s.getTotalPurchases() : 0)
                        + " | Rating: " + (s.getRating() != null ? s.getRating() : "N/A"))
                        .collect(Collectors.joining("\n")),

                java.time.LocalDate.now().toString()
        );
    }

    private String buildChatPrompt(String context, String userQuestion) {
        return """
You are an AI business intelligence assistant for an FMCG distribution company called Apex FMCG Distributors.
You have access to live business data provided below.

IMPORTANT RULES:
1. Answer the user's SPECIFIC question directly using the data provided.
2. Use actual numbers from the data — do NOT invent figures.
3. All monetary values are in Indian Rupees (INR, ₹).
4. Be concise and specific. Give actionable insights.
5. If the data does not contain enough information to answer, say so clearly.
6. Do NOT repeat the same generic sales summary for every question.

%s

User question: %s

Provide a direct, data-driven answer to the specific question above.
""".formatted(context, userQuestion);
    }

    // ── Gemini API calls ──────────────────────────────────────────────────────

    private String callGemini(String prompt) {
        try {
            Map<String, Object> part = Map.of("text", prompt);
            Map<String, Object> content = Map.of("role", "user", "parts", List.of(part));
            Map<String, Object> body = Map.of("contents", List.of(content));
            return doGeminiRequest(body);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(500, "AI_ERROR", "Failed to call AI service: " + e.getMessage());
        }
    }

    private String callGeminiWithImage(String prompt, String base64Image, String mimeType) {
        try {
            List<Map<String, Object>> parts = new ArrayList<>();
            parts.add(Map.of("text", prompt));
            parts.add(Map.of("inlineData", Map.of("mimeType", mimeType, "data", base64Image)));
            Map<String, Object> content = Map.of("role", "user", "parts", parts);
            Map<String, Object> body = Map.of("contents", List.of(content));
            return doGeminiRequest(body);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(500, "AI_ERROR", "Failed to call AI service: " + e.getMessage());
        }
    }

    private String doGeminiRequest(Map<String, Object> body) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                + geminiApiKey;
        String requestBody = objectMapper.writeValueAsString(body);

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 400) {
            throw new AppException(400, "AI_ERROR", "Gemini API rejected the request (400). " + getGeminiErrorMessage(response.body()));
        }
        if (response.statusCode() == 403) {
            throw new AppException(403, "AI_ERROR", "Gemini API access denied (403). Check that your GEMINI_API_KEY is valid.");
        }
        if (response.statusCode() != 200) {
            throw new AppException(500, "AI_ERROR", "Gemini API returned status " + response.statusCode() + ". " + getGeminiErrorMessage(response.body()));
        }

        if (response.body() == null || response.body().isBlank()) {
            throw new AppException(500, "AI_ERROR", "Gemini API returned an empty response.");
        }

        JsonNode root = objectMapper.readTree(response.body());
        String text = root.at("/candidates/0/content/parts/0/text").asText(null);
        if (text == null || text.isBlank()) {
            // Check for block reason
            String blockReason = root.at("/candidates/0/finishReason").asText("");
            if (!blockReason.isEmpty() && !blockReason.equals("STOP")) {
                throw new AppException(500, "AI_ERROR", "Gemini response blocked: " + blockReason);
            }
            return "I could not generate a response. Please try rephrasing your question.";
        }
        return text;
    }

    private String getGeminiErrorMessage(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return "No error details were returned by the AI provider.";
        }

        try {
            String message = objectMapper.readTree(responseBody).at("/error/message").asText("");
            if (!message.isBlank()) {
                return message;
            }
        } catch (Exception ignored) {
            // Fall through to the generic message so raw provider payloads are not exposed.
        }

        return "The AI provider returned an unexpected error response.";
    }

    private void checkApiKey() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new AppException(400, "AI_NOT_CONFIGURED",
                    "AI features require a GEMINI_API_KEY environment variable configured in the backend.");
        }
    }
}
