package com.fmgc.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class BatchActionRequest {
    @NotBlank(message = "Batch ID is required")
    private String batchId;
    private Integer quantity;
    private String reason;
    private BigDecimal discountPercent;

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(BigDecimal discountPercent) { this.discountPercent = discountPercent; }
}
