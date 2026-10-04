package com.fmgc.warehouse.dto.request;

public class UpdateTenantRequest {
    private String name;
    private String legalEntity;
    private String gstin;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String currency;

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
}
