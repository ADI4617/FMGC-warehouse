package com.fmgc.warehouse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.dto.request.AiChatRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Batch;
import com.fmgc.warehouse.model.Customer;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.repository.BatchRepository;
import com.fmgc.warehouse.repository.CustomerRepository;
import com.fmgc.warehouse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
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
    private final ObjectMapper objectMapper;

    public AiService(ProductRepository productRepository, BatchRepository batchRepository,
                     CustomerRepository customerRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.customerRepository = customerRepository;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> chat(AiChatRequest req, String tenantId) {
        checkApiKey();
        String context = buildBusinessContext(tenantId);
        String prompt = "You are an AI assistant for FMGC Warehouse. Use this business context:\n" + context + "\n\nUser: " + req.getMessage();
        String response = callGemini(prompt);
        Map<String, Object> result = new HashMap<>();
        result.put("response", response);
        return result;
    }

    public Map<String, Object> scanInvoice(AiChatRequest req, String tenantId) {
        checkApiKey();
        if (req.getImageBase64() == null || req.getImageBase64().isBlank()) {
            throw new AppException(400, "VALIDATION_ERROR", "Image data is required");
        }
        String response = callGeminiWithImage(
            "Extract invoice data from this image and return as JSON with fields: supplier, date, items (array with productName, quantity, unitPrice, total), totalAmount",
            req.getImageBase64(), req.getMimeType() != null ? req.getMimeType() : "image/jpeg");
        Map<String, Object> result = new HashMap<>();
        result.put("extractedData", response);
        return result;
    }

    public Map<String, Object> getOptimizations(String tenantId) {
        checkApiKey();
        List<Product> lowStock = productRepository.findByTenantId(tenantId).stream()
                .filter(p -> p.getInStock() != null && p.getMinThreshold() != null && p.getInStock() <= p.getMinThreshold())
                .collect(Collectors.toList());
        List<Batch> nearExpiry = batchRepository.findByTenantId(tenantId).stream()
                .filter(b -> b.getDaysToExpiry() != null && b.getDaysToExpiry() <= 15)
                .collect(Collectors.toList());
        List<Customer> overdueCustomers = customerRepository.findByTenantId(tenantId).stream()
                .filter(c -> c.getOverdueAmount() != null && c.getOverdueAmount().doubleValue() > 0)
                .collect(Collectors.toList());

        String prompt = "Analyze this warehouse data and provide optimization recommendations:\n" +
                "Low stock products: " + lowStock.size() + " items\n" +
                "Near expiry batches: " + nearExpiry.size() + " batches\n" +
                "Overdue customers: " + overdueCustomers.size() + " customers\n" +
                "Provide 3-5 actionable recommendations.";
        String response = callGemini(prompt);
        Map<String, Object> result = new HashMap<>();
        result.put("recommendations", response);
        result.put("lowStockCount", lowStock.size());
        result.put("nearExpiryCount", nearExpiry.size());
        result.put("overdueCustomerCount", overdueCustomers.size());
        return result;
    }

    private String buildBusinessContext(String tenantId) {
        List<Product> products = productRepository.findByTenantId(tenantId);
        int lowStock = (int) products.stream()
                .filter(p -> p.getInStock() != null && p.getMinThreshold() != null && p.getInStock() <= p.getMinThreshold())
                .count();
        return "Total products: " + products.size() + ", Low stock items: " + lowStock;
    }

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
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        String requestBody = objectMapper.writeValueAsString(body);
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new AppException(500, "AI_ERROR", "Gemini API error: " + response.statusCode());
        }
        JsonNode root = objectMapper.readTree(response.body());
        return root.at("/candidates/0/content/parts/0/text").asText("No response from AI");
    }

    private void checkApiKey() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new AppException(400, "AI_NOT_CONFIGURED", "AI features require a configured GEMINI_API_KEY");
        }
    }
}
