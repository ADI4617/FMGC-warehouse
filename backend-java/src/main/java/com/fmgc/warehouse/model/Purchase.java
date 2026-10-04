package com.fmgc.warehouse.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class Purchase {
    private String id;
    private String tenantId;
    private String invoiceNumber;
    private String supplierId;
    private String supplierName;
    private String date;
    private List<Map<String, Object>> items;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private boolean isAiScanned;
    private String status;
    private String documentUrl;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public List<Map<String, Object>> getItems() { return items; }
    public void setItems(List<Map<String, Object>> items) { this.items = items; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public boolean isAiScanned() { return isAiScanned; }
    public void setAiScanned(boolean aiScanned) { isAiScanned = aiScanned; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }
}
