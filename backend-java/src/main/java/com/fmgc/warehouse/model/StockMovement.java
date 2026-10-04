package com.fmgc.warehouse.model;

public class StockMovement {
    private String id;
    private String tenantId;
    private String timestamp;
    private String timeFormatted;
    private String type;
    private String sku;
    private String productName;
    private Integer quantity;
    private String referenceNo;
    private String note;
    private String actor;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public String getTimeFormatted() { return timeFormatted; }
    public void setTimeFormatted(String timeFormatted) { this.timeFormatted = timeFormatted; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }
}
