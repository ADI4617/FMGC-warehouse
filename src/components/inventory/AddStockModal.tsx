import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AddStockModal: React.FC = () => {
  const {
    isAddStockOpen,
    setIsAddStockOpen,
    products,
    addProduct,
    createPurchase,
    suppliers
  } = useApp();

  const [mode, setMode] = useState<'existing' | 'new_product'>('existing');
  
  // Existing product inbound
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState('100');
  const [purchasePrice, setPurchasePrice] = useState('2.50');
  const [batchNumber, setBatchNumber] = useState(`BAT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [expiryDate, setExpiryDate] = useState('2027-08-30');
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');

  // New product form
  const [newSku, setNewSku] = useState('BEV-NEW-01');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Beverages');
  const [newBrand, setNewBrand] = useState('Generic');
  const [newSellingPrice, setNewSellingPrice] = useState('3.50');
  const [newMinThreshold, setNewMinThreshold] = useState('50');

  if (!isAddStockOpen) return null;

  const handleInboundExisting = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId) || products[0];
    const sup = suppliers.find(s => s.id === supplierId) || suppliers[0];

    createPurchase({
      supplierId: sup.id,
      supplierName: sup.name,
      date: new Date().toISOString().substring(0, 10),
      items: [
        {
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          quantity: Number(quantity),
          freeQuantity: 0,
          unitPrice: Number(purchasePrice),
          batchNumber,
          expiryDate,
          totalAmount: Number(quantity) * Number(purchasePrice)
        }
      ],
      totalAmount: Number(quantity) * Number(purchasePrice),
      paymentStatus: 'Pending',
      isAiScanned: false,
      status: 'Confirmed'
    });

    setIsAddStockOpen(false);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      sku: newSku,
      name: newName,
      category: newCategory,
      brand: newBrand,
      inStock: Number(quantity),
      damaged: 0,
      minThreshold: Number(newMinThreshold),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(newSellingPrice),
      status: 'Healthy'
    });
    setIsAddStockOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C733E] text-2xl">warehouse</span>
            <div>
              <h3 className="text-[18px] font-serif font-bold text-[#1A1A1A]">Add Stock / Inbound Goods</h3>
              <p className="text-[11px] uppercase tracking-editorial text-[#78746D]">Warehouse Receipt Ledger</p>
            </div>
          </div>
          <button onClick={() => setIsAddStockOpen(false)} className="text-[#78746D] hover:text-[#1A1A1A] p-1 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-[#F4F1EA] border border-[#1A1A1A]/10 rounded p-1 mb-4">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`flex-1 py-1.5 text-[11.5px] font-medium uppercase tracking-editorial rounded transition-all cursor-pointer ${
              mode === 'existing' ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-2xs' : 'text-[#78746D]'
            }`}
          >
            Inbound Existing SKU
          </button>
          <button
            type="button"
            onClick={() => setMode('new_product')}
            className={`flex-1 py-1.5 text-[11.5px] font-medium uppercase tracking-editorial rounded transition-all cursor-pointer ${
              mode === 'new_product' ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-2xs' : 'text-[#78746D]'
            }`}
          >
            Register New Product SKU
          </button>
        </div>

        {mode === 'existing' ? (
          <form onSubmit={handleInboundExisting} className="space-y-3.5 text-[13px]">
            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const prod = products.find(p => p.id === e.target.value);
                  if (prod) setPurchasePrice(prod.purchasePrice.toString());
                }}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-medium text-[#1A1A1A] outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} - {p.name} (Current Stock: {p.inStock})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded text-[#1A1A1A] outline-none"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-medium font-mono-data"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Purchase Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
              <button type="button" onClick={() => setIsAddStockOpen(false)} className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded cursor-pointer text-[12px] uppercase tracking-editorial font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 font-medium rounded hover:bg-[#2A2A2A] shadow-2xs cursor-pointer text-[12px]">
                Receive Inbound Stock
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateNewProduct} className="space-y-3.5 text-[13px]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded"
                >
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Dairy</option>
                  <option>Household</option>
                  <option>Personal Care</option>
                  <option>Groceries</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Product Description / Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Premium Basmati Rice 5kg"
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Cost Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Selling Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newSellingPrice}
                  onChange={(e) => setNewSellingPrice(e.target.value)}
                  className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
              <button type="button" onClick={() => setIsAddStockOpen(false)} className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded cursor-pointer text-[12px] uppercase tracking-editorial font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 font-medium rounded hover:bg-[#2A2A2A] shadow-2xs cursor-pointer text-[12px]">
                Register Product
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
