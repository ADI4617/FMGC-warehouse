package com.fmgc.warehouse.model;

import java.math.BigDecimal;

public class Batch {
    private String id;
    private String tenantId;
    private String productId;
    private String sku;
    private String productName;
    private String batchNumber;
    private Integer quantity;
    private BigDecimal purchasePrice;
    private String expiryDate;
    private Integer daysToExpiry;
    private String mfgDate;
    private boolean isFefoPriority;
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public Integer getDaysToExpiry() { return daysToExpiry; }
    public void setDaysToExpiry(Integer daysToExpiry) { this.daysToExpiry = daysToExpiry; }
    public String getMfgDate() { return mfgDate; }
    public void setMfgDate(String mfgDate) { this.mfgDate = mfgDate; }
    public boolean isFefoPriority() { return isFefoPriority; }
    public void setFefoPriority(boolean fefoPriority) { isFefoPriority = fefoPriority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
