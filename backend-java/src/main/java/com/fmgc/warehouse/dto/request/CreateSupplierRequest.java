package com.fmgc.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CreateSupplierRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String contactPerson;
    @NotBlank(message = "Phone is required")
    private String phone;
    private String email;
    private String gstin;
    private String address;
    private BigDecimal rating;
    private Integer leadTimeDays;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }
}
