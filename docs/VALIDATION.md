# Validation Rules

All input validation via Zod schemas at the middleware layer.

## Auth
- **login**: email (string, email format, required), password (string, min 1, required)
- **signup**: fullName (string, min 2), businessName (string, min 2), email (string, email), phone (string, optional), password (string, min 6), plan (enum: Growth|Enterprise|Starter, optional)

## Products
- **create**: sku (string, required), name (string, required), category (enum), brand (string), unit (string), purchasePrice (number, ≥0), sellingPrice (number, ≥0), mrp (number, ≥0), inStock (integer, ≥0), minThreshold (integer, ≥0), gstRate (number, ≥0)
- **update**: partial of create fields

## Customers
- **create**: name (required), storeName, contactPerson, phone, email, address, zone (enum), creditLimit (≥0), paymentTermsDays (integer, ≥0)

## Suppliers
- **create**: name (required), contactPerson, phone, email, gstin, address

## Sales
- **create**: customerId (required), customerName, storeName, date, items (array, min 1), subtotal (≥0), totalAmount (≥0), amountPaid (≥0), paymentMethod (enum)

## Purchases
- **create**: supplierId (required), supplierName, date, items (array, min 1), totalAmount (≥0), paymentStatus (enum), status (enum)

## Collections
- **record**: customerId (required), amount (number, >0), paymentMethod (enum), notes (optional)

## Stock Adjustment
- **adjust**: productId (required), batchNumber (string), quantityDelta (integer), reason (string, required), isDamage (boolean, optional)

## Staff
- **invite**: name (required), email (required, email format), phone (optional), role (enum of UserRole), department (optional)
