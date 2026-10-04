package com.fmgc.warehouse.model;

import java.math.BigDecimal;

public class Tenant {
    private String id;
    private String name;
    private String legalEntity;
    private String gstin;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String currency;
    private String plan;
    private String status;
    private String createdDate;
    private Integer totalSkusCount;
    private BigDecimal monthlyRevenueEstimate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLegalEntity() { return legalEntity; }
    public void setLegalEntity(String legalEntity) { this.legalEntity = legalEntity; }
    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public Integer getTotalSkusCount() { return totalSkusCount; }
    public void setTotalSkusCount(Integer totalSkusCount) { this.totalSkusCount = totalSkusCount; }
    public BigDecimal getMonthlyRevenueEstimate() { return monthlyRevenueEstimate; }
    public void setMonthlyRevenueEstimate(BigDecimal monthlyRevenueEstimate) { this.monthlyRevenueEstimate = monthlyRevenueEstimate; }
}
