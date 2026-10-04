package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.CreateProductRequest;
import com.fmgc.warehouse.dto.request.UpdateProductRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.repository.ProductRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getProducts(String tenantId) {
        List<Product> products = productRepository.findByTenantId(tenantId);
        products.forEach(this::computeStatus);
        return products;
    }

    public Product createProduct(CreateProductRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse", "Manager");
        if (productRepository.existsBySku(req.getSku(), principal.getTenantId())) {
            throw new AppException(409, "CONFLICT", "SKU already exists");
        }
        Product p = new Product();
        p.setId(UUID.randomUUID().toString());
        p.setTenantId(principal.getTenantId());
        p.setSku(req.getSku());
        p.setName(req.getName());
        p.setCategory(req.getCategory());
        p.setBrand(req.getBrand());
        p.setUnit(req.getUnit());
        p.setPurchasePrice(req.getPurchasePrice());
        p.setSellingPrice(req.getSellingPrice());
        p.setMrp(req.getMrp());
        p.setInStock(req.getInStock() != null ? req.getInStock() : 0);
        p.setDamaged(0);
        p.setMinThreshold(req.getMinThreshold() != null ? req.getMinThreshold() : 0);
        p.setHsnCode(req.getHsnCode());
        p.setGstRate(req.getGstRate());
        p.setNotes(req.getNotes());
        p.setAiPredictedShortage(false);
        computeStatus(p);
        productRepository.save(p);
        return p;
    }

    public Product updateProduct(String id, UpdateProductRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse", "Manager");
        Product p = productRepository.findById(id, principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Product not found"));
        if (req.getName() != null) p.setName(req.getName());
        if (req.getCategory() != null) p.setCategory(req.getCategory());
        if (req.getBrand() != null) p.setBrand(req.getBrand());
        if (req.getUnit() != null) p.setUnit(req.getUnit());
        if (req.getPurchasePrice() != null) p.setPurchasePrice(req.getPurchasePrice());
        if (req.getSellingPrice() != null) p.setSellingPrice(req.getSellingPrice());
        if (req.getMrp() != null) p.setMrp(req.getMrp());
        if (req.getInStock() != null) p.setInStock(req.getInStock());
        if (req.getMinThreshold() != null) p.setMinThreshold(req.getMinThreshold());
        if (req.getHsnCode() != null) p.setHsnCode(req.getHsnCode());
        if (req.getGstRate() != null) p.setGstRate(req.getGstRate());
        if (req.getNotes() != null) p.setNotes(req.getNotes());
        computeStatus(p);
        productRepository.update(p);
        return p;
    }

    public void deleteProduct(String id, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin");
        productRepository.findById(id, principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Product not found"));
        productRepository.delete(id, principal.getTenantId());
    }

    public void computeStatus(Product p) {
        int stock = p.getInStock() != null ? p.getInStock() : 0;
        int threshold = p.getMinThreshold() != null ? p.getMinThreshold() : 0;
        if (stock == 0) {
            p.setStatus("Out of Stock");
        } else if (stock <= threshold) {
            p.setStatus("Low");
        } else {
            p.setStatus("Healthy");
        }
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
