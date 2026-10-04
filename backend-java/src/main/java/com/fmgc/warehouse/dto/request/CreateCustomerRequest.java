package com.fmgc.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CreateCustomerRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String storeName;
    private String contactPerson;
    @NotBlank(message = "Phone is required")
    private String phone;
    private String email;
    private String address;
    private String zone;
    private BigDecimal creditLimit;
    private Integer paymentTermsDays;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }
    public Integer getPaymentTermsDays() { return paymentTermsDays; }
    public void setPaymentTermsDays(Integer paymentTermsDays) { this.paymentTermsDays = paymentTermsDays; }
}
